part of 'raster_core.dart';

const int _maxSoftwareDimension = 65535;

/// Renders [scene] into premultiplied BGRA8888. [rowStride] is measured in
/// pixels, including padding; defaults to [pixelWidth]. No `dart:ui` calls.
void _renderSceneSoftware(
  _Compiler scene,
  double frame,
  NativePixelBuffer outBgra8888,
  int pixelWidth,
  int pixelHeight,
  RasterWorkspace ws, {
  int? rowStride,
}) {
  if (pixelWidth < 0 ||
      pixelHeight < 0 ||
      pixelWidth > _maxSoftwareDimension ||
      pixelHeight > _maxSoftwareDimension) {
    throw ArgumentError(
      'Raster dimensions ${pixelWidth}x$pixelHeight must be in 0..$_maxSoftwareDimension',
    );
  }
  final stride = rowStride ?? pixelWidth;
  final total = pixelWidth * pixelHeight;
  if (stride < pixelWidth ||
      (pixelHeight > 0 &&
          stride > outBgra8888.typedList.length ~/ pixelHeight)) {
    throw ArgumentError('Raster output is too small');
  }
  final allocated = stride * pixelHeight;
  if (allocated > outBgra8888.typedList.length) {
    throw ArgumentError('Raster output is too small');
  }
  if (ws.preferNative) {
    simdClearPixels(outBgra8888, allocated);
  } else {
    SwarBlender.clearPixels(outBgra8888.typedList, allocated);
  }
  if (pixelWidth <= 0 ||
      pixelHeight <= 0 ||
      scene.width <= 0 ||
      scene.height <= 0) {
    return;
  }
  final sx = pixelWidth / scene.width;
  final sy = pixelHeight / scene.height;
  final previousScene = ws._renderingScene;
  ws._renderingScene = scene;
  try {
    _renderCompilerInto(
      scene,
      frame,
      255,
      outBgra8888,
      0,
      0,
      stride,
      0,
      0,
      pixelWidth,
      pixelHeight,
      sx,
      0.0,
      0.0,
      sy,
      0.0,
      0.0,
      null,
      ws,
      0,
      true,
      ws.preferNative,
    );
    ws.maybeTrimAfterFrame(total);
  } finally {
    ws._renderingScene = previousScene;
  }
}

void _renderCompilerInto(
  _Compiler comp,
  double frame,
  int alpha,
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  RleSpans? clipMask,
  RasterWorkspace ws,
  int depth,
  bool stableTransform, [
  bool useNative = true,
]) {
  if (clipX0 >= clipX1 || clipY0 >= clipY1 || alpha <= 0) return;

  final nativeDst = useNative ? dst : null;
  final layers = comp.layers;
  for (var i = layers.length - 1; i >= 0; i--) {
    final layer = layers[i];
    if (layer.isMatteSource || !layer.visible(frame)) continue;
    final layerAlpha = layer.effectiveAlpha(frame, alpha);
    if (layerAlpha == 0) continue;

    final matte = layer.matte;
    final bm = layer.blendMode;
    final isDstOut = layer.matteType == 2 || layer.matteType == 4;
    final matteParentAlpha = layer.usesSetMatte ? 255 : alpha;
    final matteActive =
        matte != null &&
        matte.visible(frame) &&
        matte.effectiveAlpha(frame, matteParentAlpha) > 0;
    if (matte != null && !matteActive && !isDstOut) continue;
    if (!matteActive) {
      if (bm == 0) {
        _renderLayerInto(
          layer,
          frame,
          alpha,
          dst,
          dstOriginX,
          dstOriginY,
          dstStride,
          clipX0,
          clipY0,
          clipX1,
          clipY1,
          ma,
          mb,
          mc,
          md,
          mtx,
          mty,
          clipMask,
          ws,
          depth,
          stableTransform,
          useNative,
        );
      } else {
        final bounds = layer.worldBounds(frame);
        if (bounds != null) {
          var bx0 = _transformedMinX(bounds, ma, mc, mtx).floor() - 1;
          var by0 = _transformedMinY(bounds, mb, md, mty).floor() - 1;
          var bx1 = _transformedMaxX(bounds, ma, mc, mtx).ceil() + 1;
          var by1 = _transformedMaxY(bounds, mb, md, mty).ceil() + 1;
          if (bx0 < clipX0) bx0 = clipX0;
          if (by0 < clipY0) by0 = clipY0;
          if (bx1 > clipX1) bx1 = clipX1;
          if (by1 > clipY1) by1 = clipY1;
          final bw = bx1 - bx0;
          final bh = by1 - by0;
          if (bw > 0 && bh > 0) {
            final paint = layer.child == null ? layer.group?.singlePaint : null;
            if (paint != null &&
                (paint.gradient == null ||
                    (nativeDst != null &&
                        isNativeGradientSupported &&
                        (!SwarBlender.usesAdvancedBlend(bm) ||
                            isNativeAdvancedBlendSupported) &&
                        !paint.gradient!.hasFocalPoint))) {
              _renderLayerInto(
                layer,
                frame,
                alpha,
                dst,
                dstOriginX,
                dstOriginY,
                dstStride,
                bx0,
                by0,
                bx1,
                by1,
                ma,
                mb,
                mc,
                md,
                mtx,
                mty,
                clipMask,
                ws,
                depth,
                stableTransform,
                useNative,
                bm,
              );
              continue;
            }
            final layerBufPlane = ws._acquireScratch(depth * 3 + 2, bw * bh);
            if (useNative) {
              simdClearPixels(layerBufPlane, bw * bh);
            } else {
              SwarBlender.clearPixels(layerBufPlane.typedList, bw * bh);
            }

            _renderLayerInto(
              layer,
              frame,
              alpha,
              layerBufPlane,
              bx0,
              by0,
              bw,
              bx0,
              by0,
              bx1,
              by1,
              ma,
              mb,
              mc,
              md,
              mtx,
              mty,
              clipMask,
              ws,
              depth + 1,
              stableTransform,
              useNative,
              0,
              true,
              true,
            );

            final nativeComposited =
                nativeDst != null &&
                (!SwarBlender.usesAdvancedBlend(bm) ||
                    isNativeAdvancedBlendSupported) &&
                nativeBlendRect(
                  nativeDst,
                  (by0 - dstOriginY) * dstStride + bx0 - dstOriginX,
                  dstStride,
                  layerBufPlane,
                  bw,
                  bh,
                  bm,
                );
            if (!nativeComposited) {
              SwarBlender.compositeBlended(
                dst.typedList,
                bx0 - dstOriginX,
                by0 - dstOriginY,
                dstStride,
                layerBufPlane.typedList,
                0,
                0,
                bw,
                bw,
                bh,
                bm,
              );
            }
          }
        }
      }
      continue;
    }

    final isLuma = layer.matteType == 3 || layer.matteType == 4;

    // Tight world-to-device pixel box for target layer (+ 1px padding for AA).
    final targetBounds = layer.worldBounds(frame);
    if (targetBounds == null) continue;
    var tx0 = _transformedMinX(targetBounds, ma, mc, mtx).floor() - 1;
    var ty0 = _transformedMinY(targetBounds, mb, md, mty).floor() - 1;
    var tx1 = _transformedMaxX(targetBounds, ma, mc, mtx).ceil() + 1;
    var ty1 = _transformedMaxY(targetBounds, mb, md, mty).ceil() + 1;
    if (tx0 < clipX0) tx0 = clipX0;
    if (ty0 < clipY0) ty0 = clipY0;
    if (tx1 > clipX1) tx1 = clipX1;
    if (ty1 > clipY1) ty1 = clipY1;
    if (tx0 >= tx1 || ty0 >= ty1) continue;

    final matteBounds = matte.worldBounds(frame);
    var mx0 = clipX0, my0 = clipY0, mx1 = clipX0, my1 = clipY0;
    if (matteBounds != null) {
      mx0 = math.max(
        tx0,
        _transformedMinX(matteBounds, ma, mc, mtx).floor() - 1,
      );
      my0 = math.max(
        ty0,
        _transformedMinY(matteBounds, mb, md, mty).floor() - 1,
      );
      mx1 = math.min(
        tx1,
        _transformedMaxX(matteBounds, ma, mc, mtx).ceil() + 1,
      );
      my1 = math.min(
        ty1,
        _transformedMaxY(matteBounds, mb, md, mty).ceil() + 1,
      );
    }
    final overlap = mx0 < mx1 && my0 < my1;
    if (!isDstOut && !overlap) continue;
    if (isDstOut && !overlap && bm == 0 && clipMask == null) {
      _renderLayerInto(
        layer,
        frame,
        alpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        tx0,
        ty0,
        tx1,
        ty1,
        ma,
        mb,
        mc,
        md,
        mtx,
        mty,
        clipMask,
        ws,
        depth,
        stableTransform,
        useNative,
      );
      continue;
    }

    // For dstIn: only rasterize target within overlap bbox!
    final bx0 = isDstOut ? tx0 : mx0;
    final by0 = isDstOut ? ty0 : my0;
    final bx1 = isDstOut ? tx1 : mx1;
    final by1 = isDstOut ? ty1 : my1;
    final bw = bx1 - bx0;
    final bh = by1 - by0;
    final boxPixels = bw * bh;

    final layerBufPlane = ws._acquireScratch(depth * 3, boxPixels);
    if (useNative) {
      simdClearPixels(layerBufPlane, boxPixels);
    } else {
      SwarBlender.clearPixels(layerBufPlane.typedList, boxPixels);
    }
    _renderLayerInto(
      layer,
      frame,
      alpha,
      layerBufPlane,
      bx0,
      by0,
      bw,
      bx0,
      by0,
      bx1,
      by1,
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
      null,
      ws,
      depth + 1,
      stableTransform,
      useNative,
      0,
      true,
      true,
    );

    final matteBufPlane = ws._acquireScratch(depth * 3 + 1, boxPixels);
    if (useNative) {
      simdClearPixels(matteBufPlane, boxPixels);
    } else {
      SwarBlender.clearPixels(matteBufPlane.typedList, boxPixels);
    }
    if (overlap) {
      _renderLayerInto(
        matte,
        frame,
        matteParentAlpha,
        matteBufPlane,
        bx0,
        by0,
        bw,
        mx0,
        my0,
        mx1,
        my1,
        ma,
        mb,
        mc,
        md,
        mtx,
        mty,
        null,
        ws,
        depth + 1,
        stableTransform,
        useNative,
        0,
        true,
        true,
        !isLuma,
      );
    }

    // Composite matte into layerBuf, and blend layerBuf onto dst.
    if (clipMask != null) {
      _compositeMatteWithClipMaskDart(
        dst.typedList,
        dstOriginX,
        dstOriginY,
        dstStride,
        layerBufPlane.typedList,
        matteBufPlane.typedList,
        bw,
        bh,
        bx0,
        by0,
        isDstOut,
        isLuma,
        bm,
        clipMask,
      );
      continue;
    }
    if (bm == 0 &&
        useNative &&
        nativeCompositeMatte(
          dst,
          dstOriginX,
          dstOriginY,
          dstStride,
          layerBufPlane,
          matteBufPlane,
          bw,
          bh,
          bx0,
          by0,
          isDstOut,
          isLuma,
        )) {
      ws.nativeMatteComposites++;
      continue;
    }
    _compositeMatteDart(
      dst.typedList,
      dstOriginX,
      dstOriginY,
      dstStride,
      layerBufPlane.typedList,
      matteBufPlane.typedList,
      bw,
      bh,
      bx0,
      by0,
      isDstOut,
      isLuma,
      bm,
    );
  }
}

void _compositeMatteWithClipMaskDart(
  Uint32List target,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  Uint32List layerBuf,
  Uint32List matteBuf,
  int bw,
  int bh,
  int bx0,
  int by0,
  bool isDstOut,
  bool isLuma,
  int bm,
  RleSpans clipMask,
) {
  final bx1 = bx0 + bw;
  final by1 = by0 + bh;
  final data = clipMask.data;
  final count = clipMask.spanCount * 2;
  for (var i = 0; i < count; i += 2) {
    final w0 = data[i];
    final y = w0 >>> 16;
    if (y < by0) continue;
    if (y >= by1) break;
    final w1 = data[i + 1];
    final sx = w0 & 0xFFFF;
    final len = w1 >>> 8;
    final xStart = sx < bx0 ? bx0 : sx;
    final xEnd = sx + len > bx1 ? bx1 : sx + len;
    if (xStart >= xEnd) continue;
    final cov = (w1 & 0xFF) + 1;
    final srcRow = (y - by0) * bw - bx0;
    final dstRow = (y - dstOriginY) * dstStride - dstOriginX;
    for (var x = xStart; x < xEnd; x++) {
      final tPx = layerBuf[srcRow + x];
      if (tPx == 0) continue;
      final mPx = matteBuf[srcRow + x];
      final int factor;
      if (!isLuma) {
        final mAlpha = mPx >>> 24;
        factor = isDstOut ? (255 - mAlpha) : mAlpha;
      } else {
        final r = (mPx >>> 16) & 0xFF;
        final g = (mPx >>> 8) & 0xFF;
        final b = mPx & 0xFF;
        final rawLum = (19595 * r + 38470 * g + 7471 * b + 32768) >>> 16;
        final lum = rawLum > 255 ? 255 : rawLum;
        factor = isDstOut ? (255 - lum) : lum;
      }
      if (factor == 0) continue;
      var masked = factor == 255
          ? tPx
          : SwarBlender.scalePremul255(tPx, factor);
      if (cov != 256) masked = SwarBlender.scalePremul(masked, cov);
      if (masked == 0) continue;
      final d = dstRow + x;
      target[d] = bm == 0
          ? SwarBlender.blendSrcOver(masked, target[d])
          : SwarBlender.blendPixel(masked, target[d], bm);
    }
  }
}

void _compositeMatteDart(
  Uint32List target,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  Uint32List layerBuf,
  Uint32List matteBuf,
  int bw,
  int bh,
  int bx0,
  int by0,
  bool isDstOut,
  bool isLuma,
  int bm,
) {
  final dstColOffset = bx0 - dstOriginX;
  if (!isLuma && bm == 0) {
    if (!isDstOut) {
      // Alpha dstIn + normal SrcOver (most common matte path).
      for (var row = 0; row < bh; row++) {
        final srcRow = row * bw;
        final dstRow = (by0 + row - dstOriginY) * dstStride + dstColOffset;
        var col = 0;
        final colEnd4 = bw - 3;
        while (col < colEnd4) {
          final s = srcRow + col;
          final t0 = layerBuf[s];
          final t1 = layerBuf[s + 1];
          final t2 = layerBuf[s + 2];
          final t3 = layerBuf[s + 3];
          if ((t0 | t1 | t2 | t3) == 0) {
            col += 4;
            continue;
          }
          final mp0 = matteBuf[s];
          final mp1 = matteBuf[s + 1];
          final mp2 = matteBuf[s + 2];
          final mp3 = matteBuf[s + 3];
          if (((mp0 | mp1 | mp2 | mp3) & 0xFF000000) == 0) {
            col += 4;
            continue;
          }
          final d = dstRow + col;
          if ((mp0 & mp1 & mp2 & mp3) >= 0xFF000000) {
            if ((t0 & t1 & t2 & t3) >= 0xFF000000) {
              target[d] = t0;
              target[d + 1] = t1;
              target[d + 2] = t2;
              target[d + 3] = t3;
            } else {
              if (t0 != 0) target[d] = SwarBlender.blendSrcOver(t0, target[d]);
              if (t1 != 0) {
                target[d + 1] = SwarBlender.blendSrcOver(t1, target[d + 1]);
              }
              if (t2 != 0) {
                target[d + 2] = SwarBlender.blendSrcOver(t2, target[d + 2]);
              }
              if (t3 != 0) {
                target[d + 3] = SwarBlender.blendSrcOver(t3, target[d + 3]);
              }
            }
            col += 4;
            continue;
          }
          final m0 = mp0 >>> 24;
          if (t0 != 0 && m0 != 0) {
            final masked = m0 == 255 ? t0 : SwarBlender.scalePremul255(t0, m0);
            target[d] = SwarBlender.blendSrcOver(masked, target[d]);
          }
          final m1 = mp1 >>> 24;
          if (t1 != 0 && m1 != 0) {
            final masked = m1 == 255 ? t1 : SwarBlender.scalePremul255(t1, m1);
            target[d + 1] = SwarBlender.blendSrcOver(masked, target[d + 1]);
          }
          final m2 = mp2 >>> 24;
          if (t2 != 0 && m2 != 0) {
            final masked = m2 == 255 ? t2 : SwarBlender.scalePremul255(t2, m2);
            target[d + 2] = SwarBlender.blendSrcOver(masked, target[d + 2]);
          }
          final m3 = mp3 >>> 24;
          if (t3 != 0 && m3 != 0) {
            final masked = m3 == 255 ? t3 : SwarBlender.scalePremul255(t3, m3);
            target[d + 3] = SwarBlender.blendSrcOver(masked, target[d + 3]);
          }
          col += 4;
        }
        while (col < bw) {
          final tPx = layerBuf[srcRow + col];
          if (tPx != 0) {
            final mAlpha = matteBuf[srcRow + col] >>> 24;
            if (mAlpha != 0) {
              final masked = mAlpha == 255
                  ? tPx
                  : SwarBlender.scalePremul255(tPx, mAlpha);
              final i = dstRow + col;
              target[i] = SwarBlender.blendSrcOver(masked, target[i]);
            }
          }
          col++;
        }
      }
      return;
    }

    // Alpha dstOut (inverted) + normal SrcOver.
    for (var row = 0; row < bh; row++) {
      final srcRow = row * bw;
      final dstRow = (by0 + row - dstOriginY) * dstStride + dstColOffset;
      var col = 0;
      final colEnd4 = bw - 3;
      while (col < colEnd4) {
        final s = srcRow + col;
        final t0 = layerBuf[s];
        final t1 = layerBuf[s + 1];
        final t2 = layerBuf[s + 2];
        final t3 = layerBuf[s + 3];
        if ((t0 | t1 | t2 | t3) == 0) {
          col += 4;
          continue;
        }
        final mp0 = matteBuf[s];
        final mp1 = matteBuf[s + 1];
        final mp2 = matteBuf[s + 2];
        final mp3 = matteBuf[s + 3];
        if ((mp0 & mp1 & mp2 & mp3) >= 0xFF000000) {
          col += 4;
          continue;
        }
        final d = dstRow + col;
        if (((mp0 | mp1 | mp2 | mp3) & 0xFF000000) == 0) {
          if ((t0 & t1 & t2 & t3) >= 0xFF000000) {
            target[d] = t0;
            target[d + 1] = t1;
            target[d + 2] = t2;
            target[d + 3] = t3;
          } else {
            if (t0 != 0) target[d] = SwarBlender.blendSrcOver(t0, target[d]);
            if (t1 != 0) {
              target[d + 1] = SwarBlender.blendSrcOver(t1, target[d + 1]);
            }
            if (t2 != 0) {
              target[d + 2] = SwarBlender.blendSrcOver(t2, target[d + 2]);
            }
            if (t3 != 0) {
              target[d + 3] = SwarBlender.blendSrcOver(t3, target[d + 3]);
            }
          }
          col += 4;
          continue;
        }
        final f0 = 255 - (mp0 >>> 24);
        if (t0 != 0 && f0 != 0) {
          final masked = f0 == 255 ? t0 : SwarBlender.scalePremul255(t0, f0);
          target[d] = SwarBlender.blendSrcOver(masked, target[d]);
        }
        final f1 = 255 - (mp1 >>> 24);
        if (t1 != 0 && f1 != 0) {
          final masked = f1 == 255 ? t1 : SwarBlender.scalePremul255(t1, f1);
          target[d + 1] = SwarBlender.blendSrcOver(masked, target[d + 1]);
        }
        final f2 = 255 - (mp2 >>> 24);
        if (t2 != 0 && f2 != 0) {
          final masked = f2 == 255 ? t2 : SwarBlender.scalePremul255(t2, f2);
          target[d + 2] = SwarBlender.blendSrcOver(masked, target[d + 2]);
        }
        final f3 = 255 - (mp3 >>> 24);
        if (t3 != 0 && f3 != 0) {
          final masked = f3 == 255 ? t3 : SwarBlender.scalePremul255(t3, f3);
          target[d + 3] = SwarBlender.blendSrcOver(masked, target[d + 3]);
        }
        col += 4;
      }
      while (col < bw) {
        final tPx = layerBuf[srcRow + col];
        if (tPx != 0) {
          final factor = 255 - (matteBuf[srcRow + col] >>> 24);
          if (factor != 0) {
            final masked = factor == 255
                ? tPx
                : SwarBlender.scalePremul255(tPx, factor);
            final i = dstRow + col;
            target[i] = SwarBlender.blendSrcOver(masked, target[i]);
          }
        }
        col++;
      }
    }
    return;
  }

  for (var row = 0; row < bh; row++) {
    final srcRow = row * bw;
    final dstRow = (by0 + row - dstOriginY) * dstStride + dstColOffset;
    for (var col = 0; col < bw; col++) {
      final tPx = layerBuf[srcRow + col];
      if (tPx == 0) continue;
      final mPx = matteBuf[srcRow + col];
      final int factor;
      if (!isLuma) {
        final mAlpha = mPx >>> 24;
        factor = isDstOut ? (255 - mAlpha) : mAlpha;
      } else {
        // Matte pixels are already premultiplied (r = R_straight * mAlpha / 255),
        // so BT.601 luminance directly on premultiplied RGB equals
        // mAlpha * luma_straight, preserving subpixel anti-aliasing and opacity.
        final r = (mPx >>> 16) & 0xFF;
        final g = (mPx >>> 8) & 0xFF;
        final b = mPx & 0xFF;
        final rawLum = (19595 * r + 38470 * g + 7471 * b + 32768) >>> 16;
        final lum = rawLum > 255 ? 255 : rawLum;
        factor = isDstOut ? (255 - lum) : lum;
      }
      if (factor == 0) continue;
      final masked = factor == 255
          ? tPx
          : SwarBlender.scalePremul255(tPx, factor);
      final i = dstRow + col;
      target[i] = bm == 0
          ? SwarBlender.blendSrcOver(masked, target[i])
          : SwarBlender.blendPixel(masked, target[i], bm);
    }
  }
}

double _transformedMinX(Rect r, double ma, double mc, double mtx) =>
    (ma * (ma >= 0 ? r.left : r.right)) +
    (mc * (mc >= 0 ? r.top : r.bottom)) +
    mtx;
double _transformedMaxX(Rect r, double ma, double mc, double mtx) =>
    (ma * (ma >= 0 ? r.right : r.left)) +
    (mc * (mc >= 0 ? r.bottom : r.top)) +
    mtx;
double _transformedMinY(Rect r, double mb, double md, double mty) =>
    (mb * (mb >= 0 ? r.left : r.right)) +
    (md * (md >= 0 ? r.top : r.bottom)) +
    mty;
double _transformedMaxY(Rect r, double mb, double md, double mty) =>
    (mb * (mb >= 0 ? r.right : r.left)) +
    (md * (md >= 0 ? r.bottom : r.top)) +
    mty;

void _composeAffine(
  _Transform t,
  double frame,
  double pa,
  double pb,
  double pc,
  double pd,
  double ptx,
  double pty,
  Float64List out,
) {
  if (t.isSpatialIdentity) {
    out[0] = pa;
    out[1] = pb;
    out[2] = pc;
    out[3] = pd;
    out[4] = ptx;
    out[5] = pty;
    return;
  }
  if (t.isTranslationOnly) {
    t._evalTranslation(frame);
    final dx = t._dx, dy = t._dy;
    out[0] = pa;
    out[1] = pb;
    out[2] = pc;
    out[3] = pd;
    out[4] = ptx + pa * dx + pc * dy;
    out[5] = pty + pb * dx + pd * dy;
    return;
  }
  final m = t.matrix(frame);
  final la = m[0], lb = m[1], lc = m[4], ld = m[5], ltx = m[12], lty = m[13];
  out[0] = pa * la + pc * lb;
  out[1] = pb * la + pd * lb;
  out[2] = pa * lc + pc * ld;
  out[3] = pb * lc + pd * ld;
  out[4] = pa * ltx + pc * lty + ptx;
  out[5] = pb * ltx + pd * lty + pty;
}

void _renderLayerInto(
  _Layer layer,
  double frame,
  int parentAlpha,
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  RleSpans? clipMask,
  RasterWorkspace ws,
  int depth,
  bool stableTransform, [
  bool useNative = true,
  int blendMode = 0,
  bool applyMaskAlpha = true,
  bool isolated = false,
  bool alphaOnly = false,
  bool rawShadowContent = false,
  bool applyFill = true,
]) {
  if (!layer.visible(frame)) return;
  final nativeDst = useNative ? dst : null;
  final alpha = rawShadowContent ? 255 : layer.layerAlpha(frame, parentAlpha);
  final maskAlpha = applyMaskAlpha ? layer.singleMaskAlpha(frame) : 255;
  if (alpha == 0 || maskAlpha == 0) return;
  final shadow =
      rawShadowContent || alphaOnly && alpha == 255 && maskAlpha == 255
      ? null
      : layer.innerShadow;
  if (shadow != null) {
    final bounds = layer.worldBounds(frame);
    if (bounds == null) return;
    final left = _transformedMinX(bounds, ma, mc, mtx).floor() - 1;
    final top = _transformedMinY(bounds, mb, md, mty).floor() - 1;
    final right = _transformedMaxX(bounds, ma, mc, mtx).ceil() + 1;
    final bottom = _transformedMaxY(bounds, mb, md, mty).ceil() + 1;
    final x0 = math.max(left, clipX0), y0 = math.max(top, clipY0);
    final x1 = math.min(right, clipX1), y1 = math.min(bottom, clipY1);
    if (x0 >= x1 || y0 >= y1) return;
    // The style follows the layer transform, but still scales with the
    // composition (including any enclosing precomp). Clamp to the maximum
    // software viewport + 2 so fixed-point shifts cannot wrap dart2js 32-bit
    // bitwise ops or trigger signed int32 overflow UB in native kernels.
    const maxShadowOffset = 65537.0;
    final rawDx = ma * shadow.dx + mc * shadow.dy;
    final rawDy = mb * shadow.dx + md * shadow.dy;
    final dx = rawDx.isFinite
        ? rawDx.clamp(-maxShadowOffset, maxShadowOffset)
        : 0.0;
    final dy = rawDy.isFinite
        ? rawDy.clamp(-maxShadowOffset, maxShadowOffset)
        : 0.0;
    final shiftX = (dx * 256).round();
    final shiftY = (dy * 256).round();
    // dart2js `>>` returns an unsigned uint32 on negative operands; recover the
    // signed 32-bit floor quotient so positive shadow offsets do not wrap to +4e9.
    final stepX = (-shiftX >> 8).toSigned(32);
    final stepY = (-shiftY >> 8).toSigned(32);
    final weightX = -shiftX & 255, weightY = -shiftY & 255;
    // Include alpha just outside the output clip when the shifted sample
    // needs it. Shift negative sample coordinates into non-negative scratch
    // space so 16-bit RleSpans never clip the output window or forge x=0/y=0 edges.
    final reqSx0 = math.min(x0, x0 + stepX);
    final reqSy0 = math.min(y0, y0 + stepY);
    final reqSx1 = math.max(x1, x1 + stepX + (weightX == 0 ? 0 : 1));
    final reqSy1 = math.max(y1, y1 + stepY + (weightY == 0 ? 0 : 1));
    var rawSx0 = math.min(x0, math.max(left, reqSx0));
    var rawSy0 = math.min(y0, math.max(top, reqSy0));
    var rawSx1 = math.max(x1, math.min(right, reqSx1));
    var rawSy1 = math.max(y1, math.min(bottom, reqSy1));
    if (rawSx1 - rawSx0 > 65535) {
      rawSx0 = math.max(rawSx0, x1 - 65535);
      rawSx1 = math.min(rawSx1, rawSx0 + 65535);
    }
    if (rawSy1 - rawSy0 > 65535) {
      rawSy0 = math.max(rawSy0, y1 - 65535);
      rawSy1 = math.min(rawSy1, rawSy0 + 65535);
    }
    if (rawSx0 >= 0 && rawSx1 > 65535) rawSx1 = 65535;
    if (rawSy0 >= 0 && rawSy1 > 65535) rawSy1 = 65535;
    const maxShadowScratchPixels = 16 * 1024 * 1024;
    if ((rawSx1 - rawSx0) * (rawSy1 - rawSy0) > maxShadowScratchPixels) {
      rawSx0 = x0;
      rawSy0 = y0;
      rawSx1 = x1;
      rawSy1 = y1;
    }
    final shiftOffX = rawSx0 < 0 ? -rawSx0 : 0;
    final shiftOffY = rawSy0 < 0 ? -rawSy0 : 0;
    final renderSx0 = rawSx0 + shiftOffX;
    final renderSy0 = rawSy0 + shiftOffY;
    final renderSx1 = rawSx1 + shiftOffX;
    final renderSy1 = rawSy1 + shiftOffY;
    final reuse =
        isolated &&
        clipMask == null &&
        shiftOffX == 0 &&
        shiftOffY == 0 &&
        rawSx0 == x0 &&
        rawSy0 == y0 &&
        rawSx1 == x1 &&
        rawSy1 == y1;
    final w = renderSx1 - renderSx0, h = renderSy1 - renderSy0;
    final plane = reuse ? dst : ws._acquireScratch(depth * 3 + 2, w * h);
    final renderOx = reuse ? dstOriginX : renderSx0;
    final renderOy = reuse ? dstOriginY : renderSy0;
    final srcOx = reuse ? dstOriginX : rawSx0;
    final srcOy = reuse ? dstOriginY : rawSy0;
    final stride = reuse ? dstStride : w;
    if (!reuse) {
      if (ws.preferNative) {
        simdClearPixels(plane, w * h);
      } else {
        SwarBlender.clearPixels(plane.typedList, w * h);
      }
    }
    // Render the unclipped silhouette (clipMask: null) so enclosing parent
    // masks do not carve false inner-shadow borders; apply clipMask once on composite.
    _renderLayerInto(
      layer,
      frame,
      255,
      plane,
      renderOx,
      renderOy,
      stride,
      renderSx0,
      renderSy0,
      renderSx1,
      renderSy1,
      ma,
      mb,
      mc,
      md,
      mtx + shiftOffX,
      mty + shiftOffY,
      null,
      ws,
      reuse ? depth : depth + 1,
      stableTransform,
      reuse ? useNative : ws.preferNative,
      0,
      false,
      false,
      false,
      true,
    );
    final opacity = SwarBlender.div255(alpha * maskAlpha);
    final skipTint = alphaOnly || (shiftX == 0 && shiftY == 0);
    if (!skipTint &&
        clipMask == null &&
        blendMode == 0 &&
        nativeDst != null &&
        stride == w &&
        srcOx == rawSx0 &&
        srcOy == rawSy0 &&
        (!reuse || opacity == 255) &&
        nativeInnerShadow(
          nativeDst,
          (y0 - dstOriginY) * dstStride + x0 - dstOriginX,
          dstStride,
          plane,
          w,
          h,
          x0 - rawSx0,
          y0 - rawSy0,
          x1 - x0,
          y1 - y0,
          stepX,
          stepY,
          weightX,
          weightY,
          ((255 - shadow.channel(16)) << 16) |
              ((255 - shadow.channel(8)) << 8) |
              (255 - shadow.channel(0)),
          opacity,
        )) {
      return;
    }
    _compositeInnerShadow(
      shadow,
      opacity,
      blendMode,
      plane.typedList,
      srcOx,
      srcOy,
      stride,
      (rawSx0, rawSy0, rawSx1, rawSy1),
      dst.typedList,
      dstOriginX,
      dstOriginY,
      dstStride,
      (x0, y0, x1, y1),
      stepX,
      stepY,
      weightX,
      weightY,
      reuse,
      skipTint,
      clipMask,
    );
    return;
  }
  final fill = applyFill ? layer.fillEffect : null;
  final color = fill?.argb(frame);
  final argb = alphaOnly && color != null && color >>> 24 == 255 ? null : color;
  if (maskAlpha != 255 || argb != null) {
    final opacity = argb == null
        ? maskAlpha
        : SwarBlender.div255((argb >>> 24) * maskAlpha);
    if (opacity == 0) return;
    final bounds = layer.worldBounds(frame);
    if (bounds == null) return;
    final x0 = math.max(
      clipX0,
      _transformedMinX(bounds, ma, mc, mtx).floor() - 1,
    );
    final y0 = math.max(
      clipY0,
      _transformedMinY(bounds, mb, md, mty).floor() - 1,
    );
    final x1 = math.min(
      clipX1,
      _transformedMaxX(bounds, ma, mc, mtx).ceil() + 1,
    );
    final y1 = math.min(
      clipY1,
      _transformedMaxY(bounds, mb, md, mty).ceil() + 1,
    );
    final w = x1 - x0, h = y1 - y0;
    if (w <= 0 || h <= 0) return;
    final plane = ws._acquireScratch(depth * 3 + 2, w * h);
    if (useNative) {
      simdClearPixels(plane, w * h);
    } else {
      SwarBlender.clearPixels(plane.typedList, w * h);
    }
    _renderLayerInto(
      layer,
      frame,
      parentAlpha,
      plane,
      x0,
      y0,
      w,
      x0,
      y0,
      x1,
      y1,
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
      clipMask,
      ws,
      depth + 1,
      stableTransform,
      useNative,
      0,
      false,
      false,
      alphaOnly,
      false,
      false,
    );
    final pixels = plane.typedList;
    final target = dst.typedList;
    var row = (y0 - dstOriginY) * dstStride + x0 - dstOriginX;
    for (var y = 0; y < h; y++, row += dstStride) {
      for (var x = 0; x < w; x++) {
        final p = pixels[y * w + x];
        if (p == 0) continue;
        final src = argb == null
            ? SwarBlender.scalePremul255(p, opacity)
            : SwarBlender.scalePremul255(
                0xff000000 | (argb & 0xffffff),
                SwarBlender.div255((p >>> 24) * opacity),
              );
        final i = row + x;
        target[i] = blendMode == 0
            ? SwarBlender.blendSrcOver(src, target[i])
            : SwarBlender.blendPixel(src, target[i], blendMode);
      }
    }
    return;
  }

  // Build parent->child transform chain iteratively into affine matrix.
  var ca = ma, cb = mb, cc = mc, cd = md, ctx = mtx, cty = mty;
  if (layer.hasAnySpatialTransform) {
    // Collect ancestors top-down without allocating a list: check depth.
    var chainLen = 0;
    for (_Layer? p = layer; p != null; p = p.parent) {
      chainLen++;
    }
    if (chainLen == 1) {
      final m = ws._stackMatrix(depth);
      _composeAffine(layer.transform, frame, ca, cb, cc, cd, ctx, cty, m);
      ca = m[0];
      cb = m[1];
      cc = m[2];
      cd = m[3];
      ctx = m[4];
      cty = m[5];
    } else {
      final chain = ws._layerChain;
      while (chain.length < chainLen) {
        chain.add(null);
      }
      var k = chainLen - 1;
      for (_Layer? p = layer; p != null; p = p.parent) {
        chain[k--] = p;
      }
      final m = ws._stackMatrix(depth);
      for (var i = 0; i < chainLen; i++) {
        _composeAffine(chain[i]!.transform, frame, ca, cb, cc, cd, ctx, cty, m);
        chain[i] = null;
        ca = m[0];
        cb = m[1];
        cc = m[2];
        cd = m[3];
        ctx = m[4];
        cty = m[5];
      }
    }
  }

  final stable = stableTransform && layer.hasStaticSpatialChain;
  RleSpans? effectiveClipMask = clipMask;
  var effClipX0 = clipX0,
      effClipY0 = clipY0,
      effClipX1 = clipX1,
      effClipY1 = clipY1;
  final masks = layer.masks;
  if (masks != null && layer.hasActiveMasks) {
    // Retain the mask before intersecting any ancestor coverage. An ancestor's
    // animated mask can change even while this transform and clip box are fixed.
    final key = ws.retainCoverage && stable && layer.hasStaticMaskCoverage
        ? (ca, cb, cc, cd, ctx, cty, clipX0, clipY0, clipX1, clipY1)
        : null;
    final retained = key == null ? null : ws._retained(layer, key);
    RleSpans layerMaskSpans;
    if (retained == null) {
      layerMaskSpans = ws._acquireMaskSpans(depth)..clear();
      _rasterLayerMask(
        masks,
        frame,
        ca,
        cb,
        cc,
        cd,
        ctx,
        cty,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        layerMaskSpans,
        ws,
        depth,
      );
      if (key != null) ws._retain(layer, key, layerMaskSpans);
    } else if (clipMask == null && retained.spanCount != 0) {
      // Children can populate the shared cache and evict this entry. Keep
      // the active clip in depth-local scratch for the duration of the draw.
      layerMaskSpans = ws._acquireMaskSpans(depth)..copyFrom(retained);
    } else {
      layerMaskSpans = retained;
    }
    if (layerMaskSpans.spanCount == 0) return;
    if (clipMask != null) {
      final intersected = ws._acquireIntersectMaskSpans(depth);
      RleSpans.intersect(layerMaskSpans, clipMask, intersected);
      if (intersected.spanCount == 0) return;
      effectiveClipMask = intersected;
    } else {
      effectiveClipMask = layerMaskSpans;
    }
    effClipX0 = math.max(effClipX0, effectiveClipMask.minX);
    effClipY0 = math.max(effClipY0, effectiveClipMask.minY);
    effClipX1 = math.min(effClipX1, effectiveClipMask.maxX);
    effClipY1 = math.min(effClipY1, effectiveClipMask.maxY);
    if (effClipX0 >= effClipX1 || effClipY0 >= effClipY1) return;
  }

  final group = layer.group;
  final child = layer.child;
  // Isolate layers carrying complex fractional-opacity masks (multi-mask,
  // subtract, or inverted mask with < 100% opacity) so overlapping paints and
  // precomp children are masked once as a unit, matching Canvas saveLayer(dstIn).
  final isRotatedPrecompOnly =
      group == null && child != null && !(cb.abs() < 1e-9 && cc.abs() < 1e-9);
  final isolateComplexMask =
      !isRotatedPrecompOnly &&
      effectiveClipMask != null &&
      masks != null &&
      layer.hasActiveMasks &&
      layer._hasComplexMaskOpacity(frame);
  final NativePixelBuffer renderDst;
  final int renderOx, renderOy, renderStride, renderBlend;
  final RleSpans? renderClipMask;
  if (isolateComplexMask) {
    final w = effClipX1 - effClipX0;
    final h = effClipY1 - effClipY0;
    renderDst = ws._acquireScratch(depth * 3 + 2, w * h);
    if (useNative) {
      simdClearPixels(renderDst, w * h);
    } else {
      SwarBlender.clearPixels(renderDst.typedList, w * h);
    }
    renderOx = effClipX0;
    renderOy = effClipY0;
    renderStride = w;
    renderBlend = 0;
    renderClipMask = null;
  } else {
    renderDst = dst;
    renderOx = dstOriginX;
    renderOy = dstOriginY;
    renderStride = dstStride;
    renderBlend = blendMode;
    renderClipMask = effectiveClipMask;
  }
  if (group != null) {
    _renderGroupInto(
      group,
      frame,
      alpha,
      renderDst,
      renderOx,
      renderOy,
      renderStride,
      effClipX0,
      effClipY0,
      effClipX1,
      effClipY1,
      ca,
      cb,
      cc,
      cd,
      ctx,
      cty,
      renderClipMask,
      ws,
      depth + 1,
      stable,
      useNative,
      renderBlend,
    );
  }

  if (child != null) {
    final childFrame = layer.childFrame(frame);
    final cw = child.width, ch = child.height;
    // Axis-aligned clip rect when no rotation/skew (cb == 0 && cc == 0), else precomp scratch.
    if (cb.abs() < 1e-9 && cc.abs() < 1e-9) {
      final x0 = (ctx + (ca >= 0 ? 0.0 : ca * cw)).floor();
      final x1 = (ctx + (ca >= 0 ? ca * cw : 0.0)).ceil();
      final y0 = (cty + (cd >= 0 ? 0.0 : cd * ch)).floor();
      final y1 = (cty + (cd >= 0 ? cd * ch : 0.0)).ceil();
      final nx0 = math.max(effClipX0, x0);
      final ny0 = math.max(effClipY0, y0);
      final nx1 = math.min(effClipX1, x1);
      final ny1 = math.min(effClipY1, y1);
      if (nx0 < nx1 && ny0 < ny1) {
        _renderCompilerInto(
          child,
          childFrame,
          alpha,
          renderDst,
          renderOx,
          renderOy,
          renderStride,
          nx0,
          ny0,
          nx1,
          ny1,
          ca,
          cb,
          cc,
          cd,
          ctx,
          cty,
          renderClipMask,
          ws,
          depth + 1,
          stable,
          useNative,
        );
      }
    } else {
      // Rotated/skewed precomp clip quad via bounded scratch buffer masked by clip quad RLE.
      final childBounds = child.boundsRect;
      final rx0 = math.max(
        effClipX0,
        _transformedMinX(childBounds, ca, cc, ctx).floor() - 1,
      );
      final ry0 = math.max(
        effClipY0,
        _transformedMinY(childBounds, cb, cd, cty).floor() - 1,
      );
      final rx1 = math.min(
        effClipX1,
        _transformedMaxX(childBounds, ca, cc, ctx).ceil() + 1,
      );
      final ry1 = math.min(
        effClipY1,
        _transformedMaxY(childBounds, cb, cd, cty).ceil() + 1,
      );
      if (rx0 < rx1 && ry0 < ry1) {
        final bw = rx1 - rx0, bh = ry1 - ry0;
        final preDepth = isolateComplexMask ? depth + 1 : depth;
        final preBufPlane = ws._acquireScratch(preDepth * 3 + 2, bw * bh);
        if (useNative) {
          simdClearPixels(preBufPlane, bw * bh);
        } else {
          SwarBlender.clearPixels(preBufPlane.typedList, bw * bh);
        }
        _renderCompilerInto(
          child,
          childFrame,
          alpha,
          preBufPlane,
          rx0,
          ry0,
          bw,
          rx0,
          ry0,
          rx1,
          ry1,
          ca,
          cb,
          cc,
          cd,
          ctx,
          cty,
          null,
          ws,
          preDepth + 1,
          stable,
          useNative,
        );
        // Rasterize transformed precomp clip rect into ws._clipSpans.
        ws._polyPath
          ..clear()
          ..beginContour(true)
          ..addVertex(ctx, cty)
          ..addVertex(ca * cw + ctx, cb * cw + cty)
          ..addVertex(ca * cw + cc * ch + ctx, cb * cw + cd * ch + cty)
          ..addVertex(cc * ch + ctx, cd * ch + cty)
          ..endContour();
        ws._rasterize(ws._polyPath, false, ws._clipSpans, rx0, ry0, rx1, ry1);
        var spansToBlend = ws._clipSpans;
        if (renderClipMask != null) {
          RleSpans.intersect(
            ws._clipSpans,
            renderClipMask,
            ws._intersectSpans,
          );
          spansToBlend = ws._intersectSpans;
        }
        final count = spansToBlend.spanCount * 2;
        final sdata = spansToBlend.data;
        final preBuf = preBufPlane.typedList;
        final target = renderDst.typedList;
        for (var k = 0; k < count; k += 2) {
          final w0 = sdata[k], w1 = sdata[k + 1];
          final y = w0 >>> 16,
              x = w0 & 0xFFFF,
              len = w1 >>> 8,
              cov = (w1 & 0xFF) + 1;
          final sRow = (y - ry0) * bw + (x - rx0);
          final dRow = (y - renderOy) * renderStride + (x - renderOx);
          for (var c = 0; c < len; c++) {
            final p = preBuf[sRow + c];
            if (p != 0) {
              final scaled = cov == 256 ? p : SwarBlender.scalePremul(p, cov);
              final i = dRow + c;
              target[i] = renderBlend == 0
                  ? SwarBlender.blendSrcOver(scaled, target[i])
                  : SwarBlender.blendPixel(scaled, target[i], renderBlend);
            }
          }
        }
      }
    }
  }

  if (isolateComplexMask) {
    final sdata = effectiveClipMask.data;
    final count = effectiveClipMask.spanCount * 2;
    final srcPx = renderDst.typedList;
    final target = dst.typedList;
    for (var k = 0; k < count; k += 2) {
      final w0 = sdata[k], w1 = sdata[k + 1];
      final y = w0 >>> 16,
          x = w0 & 0xFFFF,
          len = w1 >>> 8,
          cov = (w1 & 0xFF) + 1;
      final sRow = (y - renderOy) * renderStride + (x - renderOx);
      final dRow = (y - dstOriginY) * dstStride + (x - dstOriginX);
      for (var c = 0; c < len; c++) {
        final p = srcPx[sRow + c];
        if (p == 0) continue;
        final scaled = cov == 256 ? p : SwarBlender.scalePremul(p, cov);
        final i = dRow + c;
        target[i] = blendMode == 0
            ? SwarBlender.blendSrcOver(scaled, target[i])
            : SwarBlender.blendPixel(scaled, target[i], blendMode);
      }
    }
  }
}

void _compositeInnerShadow(
  _InnerShadow shadow,
  int opacity,
  int blendMode,
  Uint32List src,
  int sx,
  int sy,
  int srcStride,
  _RasterClip samples,
  Uint32List dst,
  int dx,
  int dy,
  int dstStride,
  _RasterClip output,
  int stepX,
  int stepY,
  int wx,
  int wy,
  bool inPlace,
  bool skipTint, [
  RleSpans? clipMask,
]) {
  final (sx0, sy0, sx1, sy1) = samples;
  final (x0, y0, x1, y1) = output;
  final r = 255 - shadow.channel(16), g = 255 - shadow.channel(8);
  final b = 255 - shadow.channel(0);
  final div255 = SwarBlender.div255;

  int tintPixel(int p, int x, int? i0, int? i1) {
    if (skipTint) return p;
    final xA = x + stepX, xB = xA + 1;
    final validA = xA >= sx0 && xA < sx1;
    final validB = xB >= sx0 && xB < sx1;
    final a00 = i0 != null && validA ? src[i0 + xA] >>> 24 : 0;
    final a01 = i0 != null && validB ? src[i0 + xB] >>> 24 : 0;
    final a10 = i1 != null && validA ? src[i1 + xA] >>> 24 : 0;
    final a11 = i1 != null && validB ? src[i1 + xB] >>> 24 : 0;
    final edge =
        255 -
        (a00 & a01 & a10 & a11 == 255
            ? 255
            : (((a00 * (256 - wx) + a01 * wx) * (256 - wy) +
                      (a10 * (256 - wx) + a11 * wx) * wy +
                      32768) >>>
                  16));
    if (edge == 0) return p;
    return (p & 0xff000000) |
        (div255(((p >>> 16) & 255) * (255 - div255(r * edge))) << 16) |
        (div255(((p >>> 8) & 255) * (255 - div255(g * edge))) << 8) |
        div255((p & 255) * (255 - div255(b * edge)));
  }

  if (clipMask != null) {
    final data = clipMask.data;
    final count = clipMask.spanCount * 2;
    for (var sIdx = 0; sIdx < count; sIdx += 2) {
      final w0 = data[sIdx];
      final y = w0 >>> 16;
      if (y < y0) continue;
      if (y >= y1) break;
      final w1 = data[sIdx + 1];
      final cx = w0 & 0xFFFF;
      final len = w1 >>> 8;
      final xStart = cx < x0 ? x0 : cx;
      final xEnd = cx + len > x1 ? x1 : cx + len;
      if (xStart >= xEnd) continue;
      final cov = (w1 & 0xFF) + 1;
      final row0 = y + stepY;
      final row1 = row0 + 1;
      final i0 = row0 >= sy0 && row0 < sy1 ? (row0 - sy) * srcStride - sx : null;
      final i1 = row1 >= sy0 && row1 < sy1 ? (row1 - sy) * srcStride - sx : null;
      final srcRow = (y - sy) * srcStride - sx;
      final dstRow = (y - dy) * dstStride - dx;
      for (var x = xStart; x < xEnd; x++) {
        var p = src[srcRow + x];
        if (p == 0) continue;
        p = tintPixel(p, x, i0, i1);
        if (opacity != 255) p = SwarBlender.scalePremul255(p, opacity);
        if (cov != 256) p = SwarBlender.scalePremul(p, cov);
        if (p == 0) continue;
        final i = dstRow + x;
        dst[i] = blendMode == 0
            ? SwarBlender.blendSrcOver(p, dst[i])
            : SwarBlender.blendPixel(p, dst[i], blendMode);
      }
    }
    return;
  }

  // An in-place pass needs the original sample alpha. RGB writes preserve it;
  // apply layer opacity only after all samples have been read.
  for (var y = y0; y < y1; y++) {
    final row0 = y + stepY;
    final row1 = row0 + 1;
    final i0 = row0 >= sy0 && row0 < sy1 ? (row0 - sy) * srcStride - sx : null;
    final i1 = row1 >= sy0 && row1 < sy1 ? (row1 - sy) * srcStride - sx : null;
    final srcRow = (y - sy) * srcStride - sx;
    final dstRow = (y - dy) * dstStride - dx;
    for (var x = x0; x < x1; x++) {
      var p = src[srcRow + x];
      if (p == 0) continue;
      p = tintPixel(p, x, i0, i1);
      final i = dstRow + x;
      if (inPlace) {
        dst[i] = p;
      } else {
        if (opacity != 255) p = SwarBlender.scalePremul255(p, opacity);
        dst[i] = blendMode == 0
            ? SwarBlender.blendSrcOver(p, dst[i])
            : SwarBlender.blendPixel(p, dst[i], blendMode);
      }
    }
  }
  if (inPlace && opacity != 255) {
    for (var y = y0; y < y1; y++) {
      final row = (y - dy) * dstStride - dx;
      for (var x = x0; x < x1; x++) {
        dst[row + x] = SwarBlender.scalePremul255(dst[row + x], opacity);
      }
    }
  }
}

void _rasterLayerMask(
  List<_Mask> masks,
  double frame,
  double ca,
  double cb,
  double cc,
  double cd,
  double ctx,
  double cty,
  int x0,
  int y0,
  int x1,
  int y1,
  RleSpans out,
  RasterWorkspace ws,
  int depth,
) {
  final maskPoly = ws._acquireMaskPoly(depth);
  final scaleX = math.sqrt(ca * ca + cb * cb);
  final scaleY = math.sqrt(cc * cc + cd * cd);
  final maxScale = math.max(scaleX, scaleY);
  final localFlatness = maxScale <= 1e-6
      ? 0.25
      : (0.25 / maxScale).clamp(0.005, 1.5);
  final flatnessSq = localFlatness * localFlatness;
  final localPoly = ws._acquireMaskLocalPoly(depth);

  void rasterMask(_Mask mask, RleSpans target) {
    localPoly.clear();
    maskPoly.clear();
    _flattenLeaf(mask.geometry, frame, flatnessSq, localPoly);
    maskPoly.appendTransformed(localPoly, ca, cb, cc, cd, ctx, cty);
    ws._rasterize(maskPoly, false, target, x0, y0, x1, y1);
    final amount = mask.expand?.scalar(frame) ?? 0;
    if (amount == 0 || target.spanCount == 0 && amount < 0) return;
    final band = ws._strokePoly..clear();
    _expandMaskBand(localPoly, amount, localFlatness, band, ws._strokeScratch);
    maskPoly.clear();
    maskPoly.appendTransformed(band, ca, cb, cc, cd, ctx, cty);
    final edge = ws._acquireBooleanSpans(3);
    final original = ws._acquireBooleanSpans(4);
    ws._rasterize(maskPoly, false, edge, x0, y0, x1, y1);
    target.swap(original);
    RleSpans.combine(original, edge, target, amount > 0 ? 2 : 3);
  }

  if (masks.length == 1 && masks.single.clipsToPathAlone) {
    // Single-mask opacity is applied when compositing the rendered layer.
    rasterMask(masks.single, out);
  } else {
    final operand = ws._acquireBooleanSpans(0);
    final previous = ws._acquireBooleanSpans(1);
    final full = ws._acquireBooleanSpans(2);
    var started = false;
    for (final mask in masks) {
      if (mask.mode == 'n') continue;
      final op = switch (mask.mode) {
        's' => 3,
        'i' => 4,
        'f' => 5,
        _ => 2,
      };
      rasterMask(mask, operand);
      final opacity = (mask.opacity.scalar(frame) * 2.56).round().clamp(0, 256);
      if (opacity != 256) operand.scaleCoverage(opacity);
      if (mask.inverted || (!started && op == 3)) {
        if (full.spanCount == 0) {
          for (var y = y0; y < y1; y++) {
            full.addSpan(y, x0, x1 - x0, 256);
          }
        }
        if (mask.inverted) {
          operand.swap(previous);
          RleSpans.combine(full, previous, operand, 3);
        }
      }
      if (!started && op != 3) {
        out.swap(operand);
      } else if (!started) {
        RleSpans.combine(full, operand, out, op);
      } else {
        out.swap(previous);
        RleSpans.combine(previous, operand, out, op);
      }
      started = true;
    }
  }
}

void _expandMaskBand(
  PolyPath outline,
  double amount,
  double flatness,
  PolyPath band,
  _StrokeScratch scratch,
) {
  // Filled mask contours are implicitly closed. Add or remove a round band
  // in mask space so nonuniform transforms also scale the expansion.
  for (var i = 0; i < outline.contourCount; i++) {
    outline.contourClosed[i] = 1;
  }
  _expandStroke(outline, amount.abs(), 2, 2, 4, flatness, band, scratch);
}

void _renderGroupInto(
  _Group group,
  double frame,
  int alpha,
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  RleSpans? clipMask,
  RasterWorkspace ws,
  int depth,
  bool stableTransform, [
  bool useNative = true,
  int blendMode = 0,
]) {
  final transform = group.transform;
  final nextAlpha = transform.isFullyOpaque
      ? alpha
      : (alpha * transform.opacity.scalar(frame).round() / 100).round().clamp(
          0,
          255,
        );
  if (nextAlpha == 0) return;

  var ga = ma, gb = mb, gc = mc, gd = md, gtx = mtx, gty = mty;
  if (!transform.isSpatialIdentity) {
    final m = ws._stackMatrix(depth);
    _composeAffine(transform, frame, ma, mb, mc, md, mtx, mty, m);
    ga = m[0];
    gb = m[1];
    gc = m[2];
    gd = m[3];
    gtx = m[4];
    gty = m[5];
  }

  final stable = stableTransform && transform.isSpatialStatic;
  final draws = group.softwareDraws;
  for (var i = draws.length - 1; i >= 0; i--) {
    final d = draws[i];
    if (d is _Group) {
      _renderGroupInto(
        d,
        frame,
        nextAlpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        ga,
        gb,
        gc,
        gd,
        gtx,
        gty,
        clipMask,
        ws,
        depth + 1,
        stable,
        useNative,
        blendMode,
      );
    } else if (d is _Style) {
      _renderStyleInto(
        d,
        frame,
        nextAlpha,
        dst,
        dstOriginX,
        dstOriginY,
        dstStride,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        ga,
        gb,
        gc,
        gd,
        gtx,
        gty,
        clipMask,
        ws,
        stable,
        useNative,
        blendMode,
      );
    }
  }
}

void _renderStyleInto(
  _Style style,
  double frame,
  int alpha,
  NativePixelBuffer dst,
  int dstOriginX,
  int dstOriginY,
  int dstStride,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  RleSpans? clipMask,
  RasterWorkspace ws,
  bool stableTransform, [
  bool useNative = true,
  int blendMode = 0,
]) {
  final a = (alpha * style.opacity.scalar(frame).round() / 100).round().clamp(
    0,
    255,
  );
  if (a == 0) return;
  final key = ws.retainCoverage && stableTransform && style.hasStaticCoverage
      ? (ma, mb, mc, md, mtx, mty, clipX0, clipY0, clipX1, clipY1)
      : null;
  var spans = key == null ? null : ws._retained(style, key);
  if (spans == null) {
    if (!style.stroke && style.hasBooleanFill) {
      final bounds = style.drawBounds(frame);
      if (bounds == null) return;
      final clip = (
        math.max(clipX0, _transformedMinX(bounds, ma, mc, mtx).floor() - 2),
        math.max(clipY0, _transformedMinY(bounds, mb, md, mty).floor() - 2),
        math.min(clipX1, _transformedMaxX(bounds, ma, mc, mtx).ceil() + 2),
        math.min(clipY1, _transformedMaxY(bounds, mb, md, mty).ceil() + 2),
      );
      if (clip.$1 >= clip.$3 || clip.$2 >= clip.$4) return;
      spans = ws._spans;
      _rasterBooleanSources(
        style.sources,
        0,
        style.sources.length,
        frame,
        (ma, mb, mc, md, mtx, mty),
        clip,
        style.evenOdd,
        spans,
        ws,
        0,
      );
    } else {
      final bounds = _prepareStylePolygon(
        style,
        frame,
        clipX0,
        clipY0,
        clipX1,
        clipY1,
        ma,
        mb,
        mc,
        md,
        mtx,
        mty,
        ws,
      );
      if (bounds == null) return;
      final (x0, y0, x1, y1) = bounds;
      final useEvenOdd = !style.stroke && style.evenOdd;
      final canFuseSolid =
          clipMask == null && style.gradient == null && blendMode == 0;
      if (canFuseSolid && useNative) {
        final color = _stylePremul(style, frame, a);
        if (ws._rasterizeSolid(
          ws._workPolyB,
          useEvenOdd,
          ws._spans,
          x0,
          y0,
          x1,
          y1,
          dst,
          dstOriginX,
          dstOriginY,
          dstStride,
          color,
        )) {
          spans = ws._spans;
          if (key != null && spans.spanCount > 0) ws._retain(style, key, spans);
          return;
        }
      } else if (canFuseSolid && !useNative && key == null) {
        final color = _stylePremul(style, frame, a);
        if (ws._rasterizeSolidDart(
          ws._workPolyB,
          useEvenOdd,
          x0,
          y0,
          x1,
          y1,
          dst.typedList,
          dstOriginX,
          dstOriginY,
          dstStride,
          color,
        )) {
          return;
        }
      }
      ws._rasterize(ws._workPolyB, useEvenOdd, ws._spans, x0, y0, x1, y1);
      spans = ws._spans;
    }
    if (key != null && spans.spanCount > 0) ws._retain(style, key, spans);
  }
  if (clipMask != null) {
    RleSpans.intersect(spans, clipMask, ws._intersectSpans);
    spans = ws._intersectSpans;
  }
  if (spans.spanCount == 0) return;

  // Rasterizing or allocating a gradient may grow the Wasm heap. Acquire a
  // fresh view only after that work and use it in allocation-free pixel loops.
  final nativeDst = useNative ? dst : null;
  final grad = style.gradient;
  if (grad == null) {
    final color = _stylePremul(style, frame, a);
    if (blendMode == 0) {
      SwarBlender.fillSolidSpans(
        dst.typedList,
        dstOriginX,
        dstOriginY,
        dstStride,
        spans,
        color,
        nativeDst,
      );
    } else {
      SwarBlender.blendSolidSpans(
        dst.typedList,
        dstOriginX,
        dstOriginY,
        dstStride,
        spans,
        color,
        blendMode,
        nativeDst,
      );
    }
  } else {
    final det = ma * md - mb * mc;
    if (det.abs() <= 1e-12) return;
    final invDet = 1.0 / det;
    final ia = md * invDet;
    final ib = -mb * invDet;
    final ic = -mc * invDet;
    final id = ma * invDet;
    final itx = (mc * mty - md * mtx) * invDet;
    final ity = (mb * mtx - ma * mty) * invDet;
    final lut = _evalGradientLut(grad, frame, ws);
    final s = grad.start.at(frame);
    final e = grad.end.at(frame);
    if (grad.hasFocalPoint) {
      final fx = e[0] - s[0], fy = e[1] - s[1];
      final focus = grad.focalOffset(frame, fx, fy);
      if (focus != null) {
        _fillFocalGradientSpans(
          dst.typedList,
          dstOriginX,
          dstOriginY,
          dstStride,
          spans,
          lut.typedList,
          a,
          blendMode,
          (ia, ib, ic, id, itx, ity),
          s[0],
          s[1],
          math.max(.001, _hypot(fx, fy)),
          focus,
        );
        return;
      }
    }
    if (nativeDst != null &&
        isNativeGradientSupported &&
        nativeGradientSpans(
          nativeDst,
          dstOriginX,
          dstOriginY,
          dstStride,
          spans.buffer,
          spans.spanCount,
          lut,
          a,
          blendMode,
          grad.radial,
          ia,
          ib,
          ic,
          id,
          itx,
          ity,
          s[0],
          s[1],
          e[0],
          e[1],
        )) {
      return;
    }
    if (grad.radial) {
      SwarBlender.fillRadialGradientSpans(
        dst.typedList,
        dstOriginX,
        dstOriginY,
        dstStride,
        spans,
        lut.typedList,
        a,
        ia,
        ib,
        ic,
        id,
        itx,
        ity,
        s[0],
        s[1],
        e[0],
        e[1],
      );
    } else {
      SwarBlender.fillLinearGradientSpans(
        dst.typedList,
        dstOriginX,
        dstOriginY,
        dstStride,
        spans,
        lut.typedList,
        a,
        ia,
        ib,
        ic,
        id,
        itx,
        ity,
        s[0],
        s[1],
        e[0],
        e[1],
      );
    }
  }
}

void _fillFocalGradientSpans(
  Uint32List dst,
  int ox,
  int oy,
  int stride,
  RleSpans spans,
  Uint32List lut,
  int opacity,
  int blendMode,
  _RasterAffine inverse,
  double cx,
  double cy,
  double radius,
  (double, double) focus,
) {
  final (ia, ib, ic, id, itx, ity) = inverse;
  final (fx, fy) = focus;
  final k = 1 - fx * fx - fy * fy;
  if (!(k > 1e-12) || !(radius > 0.0) || !radius.isFinite) return;
  final stepX = ia / radius, stepY = ib / radius;
  final data = spans.data;
  for (var i = 0; i < spans.spanCount * 2; i += 2) {
    final xy = data[i], run = data[i + 1];
    final x = xy & 65535, y = xy >>> 16;
    final cov = (run & 255) + 1;
    var dx = (ia * (x + .5) + ic * (y + .5) + itx - cx) / radius - fx;
    var dy = (ib * (x + .5) + id * (y + .5) + ity - cy) / radius - fy;
    final start = (y - oy) * stride + x - ox;
    final end = start + (run >>> 8);
    for (var p = start; p < end; p++, dx += stepX, dy += stepY) {
      // Solve |focus + (pixel - focus) / t| = 1 for the positive t.
      final dot = dx * fx + dy * fy;
      final disc = dot * dot + k * (dx * dx + dy * dy);
      final root = disc > 0.0 ? math.sqrt(disc) : 0.0;
      final t = (dot + root) / k;
      final idx = !(t > 0.0)
          ? 0
          : (t >= 1.0 ? 1023 : (t * 1023.0 + .5).toInt());
      var color = lut[idx];
      if (opacity != 255) color = SwarBlender.scalePremul255(color, opacity);
      if (cov != 256) color = SwarBlender.scalePremul(color, cov);
      dst[p] = blendMode == 0
          ? SwarBlender.blendSrcOver(color, dst[p])
          : SwarBlender.blendPixel(color, dst[p], blendMode);
    }
  }
}

// Evaluate boolean fills in device-space coverage, so this path can run on
// worker isolates. Coverage multiplication approximates subpixel intersections;
// strokes and trims still need contour geometry.
typedef _RasterAffine = (double, double, double, double, double, double);
typedef _RasterClip = (int, int, int, int);

bool _hasBooleanPath(_PathSource source) => switch (source) {
  _MergePathSource s => s.hasBooleanPath,
  _Group s => s.hasBooleanPath,
  _Shape s => _hasBooleanPath(s.content),
  _ => false,
};

void _rasterBooleanSources(
  List<_PathSource> sources,
  int start,
  int end,
  double frame,
  _RasterAffine matrix,
  _RasterClip clip,
  bool evenOdd,
  RleSpans out,
  RasterWorkspace ws,
  int depth,
) {
  if (end - start == 1 && _hasBooleanPath(sources[start])) {
    _rasterBooleanSource(
      sources[start],
      frame,
      matrix,
      clip,
      evenOdd,
      out,
      ws,
      depth,
    );
    return;
  }
  final (a, b, c, d, tx, ty) = matrix;
  final poly = ws._workPolyB..clear();
  for (var i = start; i < end; i++) {
    final source = sources[i];
    if (!_hasBooleanPath(source)) {
      _appendSourceLocal(source, frame, a, b, c, d, tx, ty, 0.0625, poly, ws);
    }
  }
  if (poly.contourCount == 0) {
    out.clear();
  } else {
    ws._rasterize(poly, evenOdd, out, clip.$1, clip.$2, clip.$3, clip.$4);
  }

  final base = depth * 2;
  RleSpans? operand, previous;
  for (var i = start; i < end; i++) {
    final source = sources[i];
    if (!_hasBooleanPath(source)) continue;
    if (out.spanCount == 0) {
      _rasterBooleanSource(
        source,
        frame,
        matrix,
        clip,
        evenOdd,
        out,
        ws,
        depth + 1,
      );
    } else {
      operand ??= ws._acquireBooleanSpans(base);
      _rasterBooleanSource(
        source,
        frame,
        matrix,
        clip,
        evenOdd,
        operand,
        ws,
        depth + 1,
      );
      previous ??= ws._acquireBooleanSpans(base + 1);
      previous.swap(out);
      RleSpans.combine(previous, operand, out, evenOdd ? 5 : 2);
    }
  }
}

void _rasterBooleanSource(
  _PathSource source,
  double frame,
  _RasterAffine matrix,
  _RasterClip clip,
  bool evenOdd,
  RleSpans out,
  RasterWorkspace ws,
  int depth,
) {
  switch (source) {
    case _Group group:
      final (a, b, c, d, tx, ty) = matrix;
      if (!group.transform.isSpatialIdentity) {
        final m = ws._groupMatrix(depth);
        _composeAffine(group.transform, frame, a, b, c, d, tx, ty, m);
        matrix = (m[0], m[1], m[2], m[3], m[4], m[5]);
      }
      _rasterBooleanSources(
        group.sources,
        0,
        group.sources.length,
        frame,
        matrix,
        clip,
        evenOdd,
        out,
        ws,
        depth + 1,
      );
    case _Shape shape:
      _rasterBooleanSource(
        shape.content,
        frame,
        matrix,
        clip,
        evenOdd,
        out,
        ws,
        depth + 1,
      );
    case _MergePathSource merge:
      final sources = merge.sources;
      if (merge.mode == 1) {
        _rasterBooleanSources(
          sources,
          0,
          sources.length,
          frame,
          matrix,
          clip,
          evenOdd,
          out,
          ws,
          depth + 1,
        );
        return;
      }
      if (sources.isEmpty) {
        out.clear();
        return;
      }
      void rasterOperand(_PathSource operandSrc, RleSpans target) {
        if (_hasBooleanPath(operandSrc)) {
          _rasterBooleanSource(
            operandSrc,
            frame,
            matrix,
            clip,
            false,
            target,
            ws,
            depth + 1,
          );
        } else {
          final (a, b, c, d, tx, ty) = matrix;
          final poly = ws._workPolyB..clear();
          _appendSourceLocal(
            operandSrc,
            frame,
            a,
            b,
            c,
            d,
            tx,
            ty,
            0.0625,
            poly,
            ws,
          );
          ws._rasterize(poly, false, target, clip.$1, clip.$2, clip.$3, clip.$4);
        }
      }
      rasterOperand(sources[0], out);
      if (sources.length == 1) {
        if (merge.mode == 3 || merge.mode == 4) out.clear();
        return;
      }
      // Fold left sequentially ((S0 op S1) op S2) with distinct ping-pong
      // buffers so RleSpans.combine never clears its own input.
      final base = depth * 2;
      final lhs = ws._acquireBooleanSpans(base);
      final rhs = ws._acquireBooleanSpans(base + 1);
      for (var i = 1; i < sources.length; i++) {
        if (out.spanCount == 0 && (merge.mode == 3 || merge.mode == 4)) {
          return;
        }
        rasterOperand(sources[i], rhs);
        lhs.swap(out);
        RleSpans.combine(lhs, rhs, out, merge.mode);
      }
    default:
      throw StateError('Expected a boolean path');
  }
}

// Geometry, stroke and trim produce coverage; paint/opacity are applied later.
(int, int, int, int)? _prepareStylePolygon(
  _Style style,
  double frame,
  int clipX0,
  int clipY0,
  int clipX1,
  int clipY1,
  double ma,
  double mb,
  double mc,
  double md,
  double mtx,
  double mty,
  RasterWorkspace ws,
) {
  double strokeWidth = 0;
  if (style.stroke) {
    strokeWidth = style.width.scalar(frame);
    if (strokeWidth <= 0) return null;
  }

  // Early bounding-box clip culling before Bézier flattening, dash, or stroke expansion.
  final localBounds = style.drawBounds(frame);
  if (localBounds == null) return null;
  final bx0 = _transformedMinX(localBounds, ma, mc, mtx).floor() - 2;
  final by0 = _transformedMinY(localBounds, mb, md, mty).floor() - 2;
  final bx1 = _transformedMaxX(localBounds, ma, mc, mtx).ceil() + 2;
  final by1 = _transformedMaxY(localBounds, mb, md, mty).ceil() + 2;
  final effClipX0 = math.max(clipX0, bx0);
  final effClipY0 = math.max(clipY0, by0);
  final effClipX1 = math.min(clipX1, bx1);
  final effClipY1 = math.min(clipY1, by1);
  if (effClipX0 >= effClipX1 || effClipY0 >= effClipY1) return null;

  // Static leaves can be placed directly in device space, even when their
  // parent animates. Fill has no local-space dash or stroke expansion step.
  final leaf = style.staticFillLeaf;
  if (leaf != null) {
    final cached = ws._staticPolyline(leaf, frame);
    if (cached.contourCount == 0) return null;
    (ws._workPolyB..clear()).appendTransformed(
      cached,
      ma,
      mb,
      mc,
      md,
      mtx,
      mty,
    );
    return (effClipX0, effClipY0, effClipX1, effClipY1);
  }

  // Only plain animated Bézier fills qualify: stroke, dash, trim and boolean
  // sources require their existing local-space semantics. Transform control
  // points once, then subdivide directly into the device polygon.
  if (ws.fuseFillTransforms &&
      !style.stroke &&
      style.dash == null &&
      style.sources.length == 1) {
    var source = style.sources.single;
    while (source is _Shape) {
      source = source.content;
    }
    if (source is _BezierGeometry && !source.isPathStatic) {
      final device = ws._workPolyB..clear();
      _flattenBezier(
        source,
        frame,
        0.0625,
        device,
        transform: (ma, mb, mc, md, mtx, mty),
      );
      ws.fusedFillDraws++;
      return device.contourCount == 0
          ? null
          : (effClipX0, effClipY0, effClipX1, effClipY1);
    }
  }

  // Determine screen-aware curve flatness tolerance in local units.
  final scaleX = math.sqrt(ma * ma + mb * mb);
  final scaleY = math.sqrt(mc * mc + md * md);
  final maxScale = math.max(scaleX, scaleY);
  final localFlatness = maxScale <= 1e-6
      ? 0.25
      : (0.25 / maxScale).clamp(0.005, 1.5);
  final flatnessSq = localFlatness * localFlatness;

  // Build local polyline path (or transformed polyline path).
  final targetPoly = ws._polyPath..clear();
  final sources = style.sources;
  for (var i = sources.length - 1; i >= 0; i--) {
    _appendSourceLocal(
      sources[i],
      frame,
      1.0,
      0.0,
      0.0,
      1.0,
      0.0,
      0.0,
      flatnessSq,
      targetPoly,
      ws,
    );
  }
  if (targetPoly.contourCount == 0) return null;

  PolyPath finalLocalPoly = targetPoly;
  final dash = style.dash;
  if (dash != null) {
    final dashed = ws._workPolyA..clear();
    _applyDash(targetPoly, dash, frame, dashed, ws._cumLengths);
    finalLocalPoly = dashed;
    if (finalLocalPoly.contourCount == 0) return null;
  }

  if (style.stroke) {
    final expanded = ws._strokePoly..clear();
    _expandStroke(
      finalLocalPoly,
      strokeWidth * 0.5,
      style.cap,
      style.join,
      style.miter,
      localFlatness,
      expanded,
      ws._strokeScratch,
    );
    finalLocalPoly = expanded;
    if (finalLocalPoly.contourCount == 0) return null;
  }

  // Transform final local contour to device pixel coordinates and rasterize.
  final devicePoly = ws._workPolyB..clear();
  devicePoly.appendTransformed(finalLocalPoly, ma, mb, mc, md, mtx, mty);

  return (effClipX0, effClipY0, effClipX1, effClipY1);
}

int _stylePremul(_Style style, double frame, int alpha) {
  final c = style.color.at(frame);
  return SwarBlender.premulBgra(
    alpha,
    (c[0] * 255).round().clamp(0, 255),
    (c[1] * 255).round().clamp(0, 255),
    (c[2] * 255).round().clamp(0, 255),
  );
}

NativePixelBuffer _evalGradientLut(
  _GradientSpec grad,
  double frame,
  RasterWorkspace ws,
) {
  // The LUT is sampled in normalized gradient space. Moving either endpoint
  // changes which index a pixel reads, not the contents of the table.
  if (grad.stops.isStatic) {
    final cached = ws._staticGradientLuts[grad];
    if (cached != null) return cached.value;
    if (ws._staticGradientLuts.length >= RasterWorkspace.maxStaticLuts) {
      final oldest = ws._staticGradientLuts.keys.first;
      ws._staticGradientLuts.remove(oldest)!.value.dispose();
    }
    final lut = NativePixelBuffer(1024);
    ws._staticGradientLuts[grad] = _SceneCacheEntry(ws._renderingScene!, lut);
    _fillGradientLut(grad, frame, lut.typedList);
    return lut;
  }
  final lut = ws._scratchGradientLut ??= NativePixelBuffer(1024);
  _fillGradientLut(grad, frame, lut.typedList);
  return lut;
}

void _fillGradientLut(_GradientSpec grad, double frame, Uint32List lut) {
  final values = grad.stops.at(frame);
  final count = grad.count;
  final rgb = grad._rgb;
  final colorOffsets = grad._colorOffsets;
  for (var i = 0; i < count; i++) {
    final base = 4 * i;
    final outBase = 3 * i;
    rgb[outBase] = Track.linearToSrgb(values[base + 1]);
    rgb[outBase + 1] = Track.linearToSrgb(values[base + 2]);
    rgb[outBase + 2] = Track.linearToSrgb(values[base + 3]);
    final v = values[base].clamp(0.0, 1.0);
    colorOffsets[i] = i > 0 && v < colorOffsets[i - 1]
        ? colorOffsets[i - 1]
        : v;
  }
  var left = 0;
  for (var k = 0; k < 1024; k++) {
    final p = k / 1023.0;
    while (left < count - 1 && colorOffsets[left + 1] <= p) {
      left++;
    }
    final prev = math.max(0, left - (p < colorOffsets[left] ? 1 : 0));
    final right = math.min(count - 1, prev + 1);
    final pL = colorOffsets[prev];
    final pR = colorOffsets[right];
    final span = pR - pL;
    final t = span <= 1e-12 ? 0.0 : ((p - pL) / span).clamp(0.0, 1.0);
    final l3 = prev * 3;
    final r3 = right * 3;
    final rf = (rgb[l3] + (rgb[r3] - rgb[l3]) * t) * 255.0;
    final gf = (rgb[l3 + 1] + (rgb[r3 + 1] - rgb[l3 + 1]) * t) * 255.0;
    final bf = (rgb[l3 + 2] + (rgb[r3 + 2] - rgb[l3 + 2]) * t) * 255.0;
    final af = grad._alphaAt(values, p) * 255.0;
    lut[k] = SwarBlender.premulBgra(
      af.round().clamp(0, 255),
      rf.round().clamp(0, 255),
      gf.round().clamp(0, 255),
      bf.round().clamp(0, 255),
    );
  }
}

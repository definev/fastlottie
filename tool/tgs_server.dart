import 'dart:async';
import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';

const _bundledTopics = <String>{
  'file_4798662.tgs',
  'file_4798663.tgs',
  'file_4798664.tgs',
  'file_4798665.tgs',
  'file_4798666.tgs',
  'file_4798668.tgs',
  'file_4798669.tgs',
  'file_4798671.tgs',
  'file_4798672.tgs',
  'file_4798673.tgs',
  'file_4798675.tgs',
  'file_4798676.tgs',
  'file_4798677.tgs',
  'file_4798678.tgs',
  'file_4798679.tgs',
  'file_4798682.tgs',
  'file_4798683.tgs',
  'file_4798684.tgs',
  'file_4798686.tgs',
  'file_4798687.tgs',
  'file_4798688.tgs',
  'file_4798689.tgs',
  'file_4798691.tgs',
  'file_4798692.tgs',
  'file_4798693.tgs',
  'file_4798694.tgs',
  'file_4798695.tgs',
  'file_4798696.tgs',
  'file_4798697.tgs',
  'file_4798698.tgs',
  'file_4798700.tgs',
  'file_4798701.tgs',
  'file_4798702.tgs',
  'file_4798703.tgs',
  'file_4798705.tgs',
  'file_4798706.tgs',
  'file_4798707.tgs',
  'file_4798708.tgs',
  'file_4798710.tgs',
  'file_4798713.tgs',
  'file_4798714.tgs',
  'file_4798715.tgs',
  'file_4798716.tgs',
  'file_4798718.tgs',
  'file_4798721.tgs',
  'file_4798722.tgs',
  'file_4798723.tgs',
  'file_4798724.tgs',
  'file_4798726.tgs',
  'file_4798727.tgs',
  'file_4798728.tgs',
  'file_4798729.tgs',
  'file_4798730.tgs',
  'file_4798731.tgs',
  'file_4798732.tgs',
  'file_4798733.tgs',
  'file_4798734.tgs',
  'file_4798735.tgs',
  'file_4798736.tgs',
  'file_4798737.tgs',
  'file_4798738.tgs',
  'file_4798739.tgs',
  'file_4798740.tgs',
  'file_4798741.tgs',
  'file_4798742.tgs',
  'file_4798743.tgs',
  'file_4798745.tgs',
  'file_4798746.tgs',
  'file_4798747.tgs',
  'file_4798748.tgs',
  'file_4798750.tgs',
  'file_4798751.tgs',
  'file_4798752.tgs',
  'file_4798753.tgs',
  'file_4798755.tgs',
  'file_4798756.tgs',
  'file_4798757.tgs',
  'file_4798758.tgs',
  'file_4798762.tgs',
  'file_4798764.tgs',
  'file_4798765.tgs',
  'file_4798766.tgs',
  'file_4798767.tgs',
  'file_4798768.tgs',
  'file_4798769.tgs',
  'file_4798770.tgs',
  'file_4798771.tgs',
  'file_4798772.tgs',
};

const _topicMetaByFile = <String, (String shortcode, String label)>{
  'file_4798661.tgs': (':newspaper:', 'Newspaper'),
  'file_4798662.tgs': (':studio_microphone:', 'Studio Microphone'),
  'file_4798663.tgs': (':zap:', 'Lightning Bolt'),
  'file_4798664.tgs': (':top:', 'TOP Arrow'),
  'file_4798665.tgs': (':bulb:', 'Light Bulb'),
  'file_4798666.tgs': (':cool:', 'COOL Button'),
  'file_4798667.tgs': (':memo:', 'Memo & Pencil'),
  'file_4798668.tgs': (':exclamation:', 'Red Exclamation'),
  'file_4798669.tgs': (':mag:', 'Magnifying Glass'),
  'file_4798670.tgs': (':calendar:', 'Calendar Dec 31'),
  'file_4798671.tgs': (':megaphone:', 'Megaphone'),
  'file_4798672.tgs': (':fire:', 'Fire Flame'),
  'file_4798673.tgs': (':file_folder:', 'Open Folder'),
  'file_4798674.tgs': (':heart:', 'Red Heart'),
  'file_4798675.tgs': (':question:', 'Red Question'),
  'file_4798676.tgs': (':chart_up:', 'Chart Increasing'),
  'file_4798677.tgs': (':chart_down:', 'Chart Decreasing'),
  'file_4798678.tgs': (':gem:', 'Diamond Gem'),
  'file_4798679.tgs': (':speaking_head:', 'Speaking Head'),
  'file_4798680.tgs': (':moneybag:', 'Money Bag'),
  'file_4798681.tgs': (':money_with_wings:', 'Money With Wings'),
  'file_4798682.tgs': (':interrobang:', 'Exclamation Question'),
  'file_4798683.tgs': (':coin:', 'Silver Coin'),
  'file_4798684.tgs': (':video_game:', 'Game Controller'),
  'file_4798685.tgs': (':currency_exchange:', 'Currency Exchange'),
  'file_4798686.tgs': (':iphone:', 'Smartphone'),
  'file_4798687.tgs': (':laptop:', 'Laptop Telegram'),
  'file_4798688.tgs': (':red_car:', 'Red Car'),
  'file_4798689.tgs': (':house:', 'House'),
  'file_4798690.tgs': (':cupid:', 'Heart With Arrow'),
  'file_4798691.tgs': (':tada:', 'Party Popper'),
  'file_4798692.tgs': (':checkered_flag:', 'Chequered Flag'),
  'file_4798693.tgs': (':bangbang:', 'Double Exclamation'),
  'file_4798694.tgs': (':trophy:', 'Trophy'),
  'file_4798695.tgs': (':clapper:', 'Clapper Board'),
  'file_4798696.tgs': (':musical_note:', 'Musical Note'),
  'file_4798697.tgs': (':underage:', 'No One Under 18'),
  'file_4798698.tgs': (':books:', 'Stack of Books'),
  'file_4798699.tgs': (':crown:', 'Gold Crown'),
  'file_4798700.tgs': (':soccer:', 'Soccer Ball'),
  'file_4798701.tgs': (':basketball:', 'Basketball'),
  'file_4798702.tgs': (':tv:', 'Television'),
  'file_4798703.tgs': (':eyes:', 'Eyes'),
  'file_4798704.tgs': (':lips:', 'Biting Lips'),
  'file_4798705.tgs': (':lipstick:', 'Lipstick'),
  'file_4798706.tgs': (':high_heel:', 'Red High Heel'),
  'file_4798707.tgs': (':luggage:', 'Leather Suitcase'),
  'file_4798708.tgs': (':beach_umbrella:', 'Beach Island'),
  'file_4798709.tgs': (':airplane:', 'Airplane'),
  'file_4798710.tgs': (':partly_sunny:', 'Sun Behind Cloud'),
  'file_4798711.tgs': (':unicorn:', 'Unicorn Rainbow'),
  'file_4798712.tgs': (':shopping_bags:', 'Shopping Bags'),
  'file_4798713.tgs': (':shopping_cart:', 'Shopping Cart'),
  'file_4798714.tgs': (':motor_boat:', 'Speedboat'),
  'file_4798715.tgs': (':handbag:', 'Handbag & Mirror'),
  'file_4798716.tgs': (':steam_locomotive:', 'Locomotive Train'),
  'file_4798717.tgs': (':camping:', 'Camping Tent'),
  'file_4798718.tgs': (':mountain:', 'Mountain Peak'),
  'file_4798719.tgs': (':robot:', 'Robot Face'),
  'file_4798720.tgs': (':mirror_ball:', 'Disco Mirror Ball'),
  'file_4798721.tgs': (':tickets:', 'Admission Tickets'),
  'file_4798722.tgs': (':pirate_flag:', 'Pirate Flag'),
  'file_4798723.tgs': (':ballot_box:', 'Ballot Box'),
  'file_4798724.tgs': (':strawberry:', 'Strawberry'),
  'file_4798725.tgs': (':telescope:', 'Telescope'),
  'file_4798726.tgs': (':mortar_board:', 'Graduation Cap'),
  'file_4798727.tgs': (':microscope:', 'Microscope'),
  'file_4798728.tgs': (':notes:', 'Musical Notes'),
  'file_4798729.tgs': (':microphone:', 'Handheld Microphone'),
  'file_4798730.tgs': (':dancer:', 'Woman Dancing'),
  'file_4798731.tgs': (':military_helmet:', 'Military Helmet'),
  'file_4798732.tgs': (':pouch:', 'Leather Pouch'),
  'file_4798733.tgs': (':man_dancing:', 'Man Dancing'),
  'file_4798734.tgs': (':nail_polish:', 'Nail Polish'),
  'file_4798735.tgs': (':test_tube:', 'Chemistry Flask'),
  'file_4798736.tgs': (':family:', 'Family Portrait'),
  'file_4798737.tgs': (':classical_building:', 'Classical Building'),
  'file_4798738.tgs': (':baby:', 'Baby Pacifier'),
  'file_4798739.tgs': (':pregnant_woman:', 'Pregnant Woman'),
  'file_4798740.tgs': (':abacus:', 'Abacus'),
  'file_4798741.tgs': (':printer:', 'Printer'),
  'file_4798742.tgs': (':police_officer:', 'Police Officer'),
  'file_4798743.tgs': (':stethoscope:', 'Stethoscope'),
  'file_4798744.tgs': (':pill:', 'Red & Yellow Pill'),
  'file_4798745.tgs': (':id_card:', 'ID Card'),
  'file_4798746.tgs': (':syringe:', 'Syringe'),
  'file_4798747.tgs': (':soap:', 'Soap & Bubbles'),
  'file_4798748.tgs': (':customs:', 'Customs Checkpoint'),
  'file_4798749.tgs': (':fish:', 'Blue Fish'),
  'file_4798750.tgs': (':art:', 'Artist Palette'),
  'file_4798751.tgs': (':performing_arts:', 'Performing Arts'),
  'file_4798752.tgs': (':plate_with_cutlery:', 'Plate & Cutlery'),
  'file_4798753.tgs': (':tophat:', 'Top Hat'),
  'file_4798754.tgs': (':crystal_ball:', 'Crystal Ball'),
  'file_4798755.tgs': (':tropical_drink:', 'Tropical Drink'),
  'file_4798756.tgs': (':birthday:', 'Birthday Cake'),
  'file_4798757.tgs': (':hamburger:', 'Cheeseburger'),
  'file_4798758.tgs': (':pizza:', 'Pizza Slice'),
  'file_4798759.tgs': (':coffee:', 'Coffee Cup'),
  'file_4798760.tgs': (':sushi:', 'Sushi Nigiri'),
  'file_4798761.tgs': (':speech_balloon:', 'Speech Balloon'),
  'file_4798762.tgs': (':christmas_tree:', 'Christmas Tree'),
  'file_4798763.tgs': (':microbe:', 'Green Microbe'),
  'file_4798764.tgs': (':writing_hand:', 'Writing Hand'),
  'file_4798765.tgs': (':star:', 'Glowing Star'),
  'file_4798766.tgs': (':jack_o_lantern:', 'Jack-O-Lantern'),
  'file_4798767.tgs': (':white_check_mark:', 'Check Mark Button'),
  'file_4798768.tgs': (':military_medal:', 'Military Medal'),
  'file_4798769.tgs': (':clown_face:', 'Clown Face'),
  'file_4798770.tgs': (':brain:', 'Brain'),
  'file_4798771.tgs': (':guide_dog:', 'Guide Dog'),
  'file_4798772.tgs': (':cat2:', 'Ginger Cat'),
};

const _notoMetaByFile = <String, (String shortcode, String label)>{
  'emoji_u1f192.tgs': (':cool_1f192:', 'Cool'),
  'emoji_u1f193.tgs': (':free:', 'Free'),
  'emoji_u1f195.tgs': (':new:', 'New'),
  'emoji_u1f197.tgs': (':ok_button:', 'Ok Button'),
  'emoji_u1f198.tgs': (':sos:', 'Sos'),
  'emoji_u1f199.tgs': (':up:', 'Up'),
  'emoji_u1f300.tgs': (':cyclone:', 'Cyclone'),
  'emoji_u1f304.tgs': (':sunrise_over_mountains:', 'Sunrise Over Mountains'),
  'emoji_u1f305.tgs': (':sunrise:', 'Sunrise'),
  'emoji_u1f307.tgs': (':sunset:', 'Sunset'),
  'emoji_u1f308.tgs': (':rainbow:', 'Rainbow'),
  'emoji_u1f30a.tgs': (':ocean:', 'Ocean'),
  'emoji_u1f30b.tgs': (':volcano:', 'Volcano'),
  'emoji_u1f30c.tgs': (':milky_way:', 'Milky Way'),
  'emoji_u1f30d.tgs': (
    ':globe_showing_europe_africa:',
    'Globe Showing Europe Africa',
  ),
  'emoji_u1f30e.tgs': (':globe_showing_americas:', 'Globe Showing Americas'),
  'emoji_u1f30f.tgs': (
    ':globe_showing_asia_australia:',
    'Globe Showing Asia Australia',
  ),
  'emoji_u1f31a.tgs': (':moon_face_new:', 'Moon Face New'),
  'emoji_u1f31b.tgs': (':moon_face_first_quarter:', 'Moon Face First Quarter'),
  'emoji_u1f31c.tgs': (':moon_face_last_quarter:', 'Moon Face Last Quarter'),
  'emoji_u1f31d.tgs': (':moon_face_full:', 'Moon Face Full'),
  'emoji_u1f31e.tgs': (':sun_with_face:', 'Sun With Face'),
  'emoji_u1f31f.tgs': (':glowing_star:', 'Glowing Star'),
  'emoji_u1f321_fe0f.tgs': (':thermometer:', 'Thermometer'),
  'emoji_u1f327_fe0f.tgs': (':rain_cloud:', 'Rain Cloud'),
  'emoji_u1f329_fe0f.tgs': (':cloud_with_lightning:', 'Cloud With Lightning'),
  'emoji_u1f32a_fe0f.tgs': (':tornado:', 'Tornado'),
  'emoji_u1f32c_fe0f.tgs': (':wind_face:', 'Wind Face'),
  'emoji_u1f32d.tgs': (':hot_dog:', 'Hot Dog'),
  'emoji_u1f32e.tgs': (':taco:', 'Taco'),
  'emoji_u1f32f.tgs': (':burrito:', 'Burrito'),
  'emoji_u1f331.tgs': (':plant:', 'Plant'),
  'emoji_u1f332.tgs': (':evergreen_tree:', 'Evergreen Tree'),
  'emoji_u1f335.tgs': (':cactus:', 'Cactus'),
  'emoji_u1f337.tgs': (':tulip:', 'Tulip'),
  'emoji_u1f338.tgs': (':cherry_blossom:', 'Cherry Blossom'),
  'emoji_u1f339.tgs': (':rose:', 'Rose'),
  'emoji_u1f33c.tgs': (':blossom:', 'Blossom'),
  'emoji_u1f33d.tgs': (':ear_of_corn:', 'Ear Of Corn'),
  'emoji_u1f33f.tgs': (':herb:', 'Herb'),
  'emoji_u1f340.tgs': (':luck:', 'Luck'),
  'emoji_u1f341.tgs': (':maple_leaf:', 'Maple Leaf'),
  'emoji_u1f342.tgs': (':fallen_leaf:', 'Fallen Leaf'),
  'emoji_u1f343.tgs': (':leaves:', 'Leaves'),
  'emoji_u1f344.tgs': (':mushroom:', 'Mushroom'),
  'emoji_u1f345.tgs': (':tomato:', 'Tomato'),
  'emoji_u1f347.tgs': (':grapes:', 'Grapes'),
  'emoji_u1f348.tgs': (':melon:', 'Melon'),
  'emoji_u1f349.tgs': (':watermelon:', 'Watermelon'),
  'emoji_u1f34a.tgs': (':tangerine:', 'Tangerine'),
  'emoji_u1f34b.tgs': (':lemon:', 'Lemon'),
  'emoji_u1f34d.tgs': (':pineapple:', 'Pineapple'),
  'emoji_u1f34e.tgs': (':red_apple:', 'Red Apple'),
  'emoji_u1f350.tgs': (':pear:', 'Pear'),
  'emoji_u1f352.tgs': (':cherries:', 'Cherries'),
  'emoji_u1f353.tgs': (':strawberry_1f353:', 'Strawberry'),
  'emoji_u1f354.tgs': (':hamburger_1f354:', 'Hamburger'),
  'emoji_u1f355.tgs': (':pizza_1f355:', 'Pizza'),
  'emoji_u1f357.tgs': (':poultry_leg:', 'Poultry Leg'),
  'emoji_u1f35c.tgs': (':steaming_bowl:', 'Steaming Bowl'),
  'emoji_u1f35d.tgs': (':spaghetti:', 'Spaghetti'),
  'emoji_u1f35e.tgs': (':bread:', 'Bread'),
  'emoji_u1f361.tgs': (':dango:', 'Dango'),
  'emoji_u1f362.tgs': (':oden:', 'Oden'),
  'emoji_u1f366.tgs': (':soft_ice_cream:', 'Soft Ice Cream'),
  'emoji_u1f368.tgs': (':ice_cream:', 'Ice Cream'),
  'emoji_u1f369.tgs': (':doughnut:', 'Doughnut'),
  'emoji_u1f36a.tgs': (':cookie:', 'Cookie'),
  'emoji_u1f373.tgs': (':cooking:', 'Cooking'),
  'emoji_u1f375.tgs': (':teacup_without_handle:', 'Teacup Without Handle'),
  'emoji_u1f377.tgs': (':wine_glass:', 'Wine Glass'),
  'emoji_u1f379.tgs': (':tropical_drink_1f379:', 'Tropical Drink'),
  'emoji_u1f37b.tgs': (':clinking_beer_mugs:', 'Clinking Beer Mugs'),
  'emoji_u1f37c.tgs': (':baby_bottle:', 'Baby Bottle'),
  'emoji_u1f37d_fe0f.tgs': (
    ':fork_and_knife_with_plate:',
    'Fork And Knife With Plate',
  ),
  'emoji_u1f37e.tgs': (
    ':bottle_with_popping_cork:',
    'Bottle With Popping Cork',
  ),
  'emoji_u1f37f.tgs': (':popcorn:', 'Popcorn'),
  'emoji_u1f381.tgs': (':wrapped_gift:', 'Wrapped Gift'),
  'emoji_u1f382.tgs': (':birthday_cake:', 'Birthday Cake'),
  'emoji_u1f386.tgs': (':fireworks:', 'Fireworks'),
  'emoji_u1f388.tgs': (':balloon:', 'Balloon'),
  'emoji_u1f389.tgs': (':party_popper:', 'Party Popper'),
  'emoji_u1f38a.tgs': (':confetti_ball:', 'Confetti Ball'),
  'emoji_u1f393.tgs': (':graduation_cap:', 'Graduation Cap'),
  'emoji_u1f39e_fe0f.tgs': (':film:', 'Film'),
  'emoji_u1f39f_fe0f.tgs': (':admission_tickets:', 'Admission Tickets'),
  'emoji_u1f3a0.tgs': (':carousel_horse:', 'Carousel Horse'),
  'emoji_u1f3a1.tgs': (':ferris_wheel:', 'Ferris Wheel'),
  'emoji_u1f3a2.tgs': (':roller_coaster:', 'Roller Coaster'),
  'emoji_u1f3a3.tgs': (':fishing_pole:', 'Fishing Pole'),
  'emoji_u1f3ac.tgs': (':clapper_1f3ac:', 'Clapper'),
  'emoji_u1f3ad.tgs': (':performing_arts_1f3ad:', 'Performing Arts'),
  'emoji_u1f3af.tgs': (':direct_hit:', 'Direct Hit'),
  'emoji_u1f3b0.tgs': (':slot_machine:', 'Slot Machine'),
  'emoji_u1f3b1.tgs': (':8_ball:', '8 Ball'),
  'emoji_u1f3b2.tgs': (':die:', 'Die'),
  'emoji_u1f3b3.tgs': (':bowling:', 'Bowling'),
  'emoji_u1f3b6.tgs': (':musical_notes:', 'Musical Notes'),
  'emoji_u1f3b7.tgs': (':saxophone:', 'Saxophone'),
  'emoji_u1f3b8.tgs': (':guitar:', 'Guitar'),
  'emoji_u1f3ba.tgs': (':trumpet:', 'Trumpet'),
  'emoji_u1f3bb.tgs': (':violin:', 'Violin'),
  'emoji_u1f3be.tgs': (':tennis:', 'Tennis'),
  'emoji_u1f3bf.tgs': (':skis:', 'Skis'),
  'emoji_u1f3c0.tgs': (':basketball_1f3c0:', 'Basketball'),
  'emoji_u1f3c1.tgs': (':chequered_flag:', 'Chequered Flag'),
  'emoji_u1f3c6.tgs': (':trophy_1f3c6:', 'Trophy'),
  'emoji_u1f3c9.tgs': (':rugby_football:', 'Rugby Football'),
  'emoji_u1f3cd_fe0f.tgs': (':motorcycle:', 'Motorcycle'),
  'emoji_u1f3ce_fe0f.tgs': (':racing_car:', 'Racing Car'),
  'emoji_u1f3cf.tgs': (':cricket_game:', 'Cricket Game'),
  'emoji_u1f3d1.tgs': (':field_hockey:', 'Field Hockey'),
  'emoji_u1f3d2.tgs': (':ice_hockey:', 'Ice Hockey'),
  'emoji_u1f3d3.tgs': (':ping_pong:', 'Ping Pong'),
  'emoji_u1f3d5_fe0f.tgs': (':camping_1f3d5:', 'Camping'),
  'emoji_u1f3da_fe0f.tgs': (':derelict_house:', 'Derelict House'),
  'emoji_u1f3de_fe0f.tgs': (':national_park:', 'National Park'),
  'emoji_u1f3e0.tgs': (':house_1f3e0:', 'House'),
  'emoji_u1f3f3_fe0f.tgs': (':white_flag:', 'White Flag'),
  'emoji_u1f3f4.tgs': (':black_flag:', 'Black Flag'),
  'emoji_u1f3f8.tgs': (':badminton:', 'Badminton'),
  'emoji_u1f400.tgs': (':rat:', 'Rat'),
  'emoji_u1f402.tgs': (':ox:', 'Ox'),
  'emoji_u1f405.tgs': (':tiger:', 'Tiger'),
  'emoji_u1f407.tgs': (':rabbit:', 'Rabbit'),
  'emoji_u1f409.tgs': (':dragon:', 'Dragon'),
  'emoji_u1f40a.tgs': (':crocodile:', 'Crocodile'),
  'emoji_u1f40c.tgs': (':snail:', 'Snail'),
  'emoji_u1f40d.tgs': (':snake:', 'Snake'),
  'emoji_u1f40e.tgs': (':racehorse:', 'Racehorse'),
  'emoji_u1f410.tgs': (':goat:', 'Goat'),
  'emoji_u1f412.tgs': (':monkey:', 'Monkey'),
  'emoji_u1f413.tgs': (':rooster:', 'Rooster'),
  'emoji_u1f415.tgs': (':dog:', 'Dog'),
  'emoji_u1f415_200d_1f9ba.tgs': (':service_dog:', 'Service Dog'),
  'emoji_u1f416.tgs': (':pig:', 'Pig'),
  'emoji_u1f419.tgs': (':octopus:', 'Octopus'),
  'emoji_u1f41b.tgs': (':bug:', 'Bug'),
  'emoji_u1f41c.tgs': (':ant:', 'Ant'),
  'emoji_u1f41d.tgs': (':bee:', 'Bee'),
  'emoji_u1f41e.tgs': (':lady_bug:', 'Lady Bug'),
  'emoji_u1f41f.tgs': (':fish_1f41f:', 'Fish'),
  'emoji_u1f421.tgs': (':blowfish:', 'Blowfish'),
  'emoji_u1f422.tgs': (':turtle:', 'Turtle'),
  'emoji_u1f423.tgs': (':hatching_chick:', 'Hatching Chick'),
  'emoji_u1f424.tgs': (':baby_chick:', 'Baby Chick'),
  'emoji_u1f425.tgs': (':hatched_chick:', 'Hatched Chick'),
  'emoji_u1f426.tgs': (':bird:', 'Bird'),
  'emoji_u1f426_200d_1f525.tgs': (':phoenix:', 'Phoenix'),
  'emoji_u1f426_200d_2b1b.tgs': (':black_bird:', 'Black Bird'),
  'emoji_u1f427.tgs': (':penguin:', 'Penguin'),
  'emoji_u1f429.tgs': (':poodle:', 'Poodle'),
  'emoji_u1f42c.tgs': (':dolphin:', 'Dolphin'),
  'emoji_u1f42e.tgs': (':cow_face:', 'Cow Face'),
  'emoji_u1f433.tgs': (':whale:', 'Whale'),
  'emoji_u1f438.tgs': (':frog:', 'Frog'),
  'emoji_u1f43a.tgs': (':wolf:', 'Wolf'),
  'emoji_u1f43b.tgs': (':bear_face:', 'Bear Face'),
  'emoji_u1f43c.tgs': (':panda:', 'Panda'),
  'emoji_u1f43e.tgs': (':paw_prints:', 'Paw Prints'),
  'emoji_u1f43f_fe0f.tgs': (':chipmunk:', 'Chipmunk'),
  'emoji_u1f440.tgs': (':eyes_1f440:', 'Eyes'),
  'emoji_u1f441_fe0f.tgs': (':eye:', 'Eye'),
  'emoji_u1f442.tgs': (':ear:', 'Ear'),
  'emoji_u1f442_1f3fb.tgs': (':ear_1f442:', 'Ear'),
  'emoji_u1f442_1f3fc.tgs': (':noto_1f442_1f3fc:', 'Ear'),
  'emoji_u1f442_1f3fd.tgs': (':noto_1f442_1f3fd:', 'Ear'),
  'emoji_u1f442_1f3fe.tgs': (':noto_1f442_1f3fe:', 'Ear'),
  'emoji_u1f442_1f3ff.tgs': (':noto_1f442_1f3ff:', 'Ear'),
  'emoji_u1f443.tgs': (':nose:', 'Nose'),
  'emoji_u1f443_1f3fb.tgs': (':nose_1f443:', 'Nose'),
  'emoji_u1f443_1f3fc.tgs': (':noto_1f443_1f3fc:', 'Nose'),
  'emoji_u1f443_1f3fd.tgs': (':noto_1f443_1f3fd:', 'Nose'),
  'emoji_u1f443_1f3fe.tgs': (':noto_1f443_1f3fe:', 'Nose'),
  'emoji_u1f443_1f3ff.tgs': (':noto_1f443_1f3ff:', 'Nose'),
  'emoji_u1f446.tgs': (':point_up:', 'Point Up'),
  'emoji_u1f446_1f3fb.tgs': (':point_up_1f446:', 'Point Up'),
  'emoji_u1f446_1f3fc.tgs': (':noto_1f446_1f3fc:', 'Point Up'),
  'emoji_u1f446_1f3fd.tgs': (':noto_1f446_1f3fd:', 'Point Up'),
  'emoji_u1f446_1f3fe.tgs': (':noto_1f446_1f3fe:', 'Point Up'),
  'emoji_u1f446_1f3ff.tgs': (':noto_1f446_1f3ff:', 'Point Up'),
  'emoji_u1f447.tgs': (':point_down:', 'Point Down'),
  'emoji_u1f447_1f3fb.tgs': (':point_down_1f447:', 'Point Down'),
  'emoji_u1f447_1f3fc.tgs': (':noto_1f447_1f3fc:', 'Point Down'),
  'emoji_u1f447_1f3fd.tgs': (':noto_1f447_1f3fd:', 'Point Down'),
  'emoji_u1f447_1f3fe.tgs': (':noto_1f447_1f3fe:', 'Point Down'),
  'emoji_u1f447_1f3ff.tgs': (':noto_1f447_1f3ff:', 'Point Down'),
  'emoji_u1f448.tgs': (':point_left:', 'Point Left'),
  'emoji_u1f448_1f3fb.tgs': (':point_left_1f448:', 'Point Left'),
  'emoji_u1f448_1f3fc.tgs': (':noto_1f448_1f3fc:', 'Point Left'),
  'emoji_u1f448_1f3fd.tgs': (':noto_1f448_1f3fd:', 'Point Left'),
  'emoji_u1f448_1f3fe.tgs': (':noto_1f448_1f3fe:', 'Point Left'),
  'emoji_u1f448_1f3ff.tgs': (':noto_1f448_1f3ff:', 'Point Left'),
  'emoji_u1f449.tgs': (':point_right:', 'Point Right'),
  'emoji_u1f449_1f3fb.tgs': (':point_right_1f449:', 'Point Right'),
  'emoji_u1f449_1f3fc.tgs': (':noto_1f449_1f3fc:', 'Point Right'),
  'emoji_u1f449_1f3fd.tgs': (':noto_1f449_1f3fd:', 'Point Right'),
  'emoji_u1f449_1f3fe.tgs': (':noto_1f449_1f3fe:', 'Point Right'),
  'emoji_u1f449_1f3ff.tgs': (':noto_1f449_1f3ff:', 'Point Right'),
  'emoji_u1f44a.tgs': (':fist:', 'Fist'),
  'emoji_u1f44a_1f3fb.tgs': (':bump:', 'Bump'),
  'emoji_u1f44a_1f3fc.tgs': (':fist_1f44a:', 'Fist'),
  'emoji_u1f44a_1f3fd.tgs': (':noto_1f44a_1f3fd:', 'Fist'),
  'emoji_u1f44a_1f3fe.tgs': (':noto_1f44a_1f3fe:', 'Fist'),
  'emoji_u1f44a_1f3ff.tgs': (':noto_1f44a_1f3ff:', 'Fist'),
  'emoji_u1f44b.tgs': (':wave:', 'Waving Hand'),
  'emoji_u1f44b_1f3fb.tgs': (':wave_1f44b:', 'Wave'),
  'emoji_u1f44b_1f3fc.tgs': (':noto_1f44b_1f3fc:', 'Wave'),
  'emoji_u1f44b_1f3fd.tgs': (':noto_1f44b_1f3fd:', 'Wave'),
  'emoji_u1f44b_1f3fe.tgs': (':noto_1f44b_1f3fe:', 'Wave'),
  'emoji_u1f44b_1f3ff.tgs': (':noto_1f44b_1f3ff:', 'Wave'),
  'emoji_u1f44c.tgs': (':ok:', 'Ok'),
  'emoji_u1f44c_1f3fb.tgs': (':ok_1f44c:', 'Ok'),
  'emoji_u1f44c_1f3fc.tgs': (':noto_1f44c_1f3fc:', 'Ok'),
  'emoji_u1f44c_1f3fd.tgs': (':noto_1f44c_1f3fd:', 'Ok'),
  'emoji_u1f44c_1f3fe.tgs': (':noto_1f44c_1f3fe:', 'Ok'),
  'emoji_u1f44c_1f3ff.tgs': (':noto_1f44c_1f3ff:', 'Ok'),
  'emoji_u1f44d.tgs': (':thumbs_up:', 'Thumbs Up'),
  'emoji_u1f44d_1f3fb.tgs': (':1:', '1'),
  'emoji_u1f44d_1f3fc.tgs': (':thumbs_up_1f44d:', 'Thumbs Up'),
  'emoji_u1f44d_1f3fd.tgs': (':noto_1f44d_1f3fd:', 'Thumbs Up'),
  'emoji_u1f44d_1f3fe.tgs': (':noto_1f44d_1f3fe:', 'Thumbs Up'),
  'emoji_u1f44d_1f3ff.tgs': (':noto_1f44d_1f3ff:', 'Thumbs Up'),
  'emoji_u1f44e.tgs': (':thumbs_down:', 'Thumbs Down'),
  'emoji_u1f44e_1f3fb.tgs': (':thumbs_down_1f44e:', 'Thumbs Down'),
  'emoji_u1f44e_1f3fc.tgs': (':noto_1f44e_1f3fc:', 'Thumbs Down'),
  'emoji_u1f44e_1f3fd.tgs': (':noto_1f44e_1f3fd:', 'Thumbs Down'),
  'emoji_u1f44e_1f3fe.tgs': (':noto_1f44e_1f3fe:', 'Thumbs Down'),
  'emoji_u1f44e_1f3ff.tgs': (':noto_1f44e_1f3ff:', 'Thumbs Down'),
  'emoji_u1f44f.tgs': (':clap:', 'Clapping Hands'),
  'emoji_u1f44f_1f3fb.tgs': (':clap_1f44f:', 'Clap'),
  'emoji_u1f44f_1f3fc.tgs': (':noto_1f44f_1f3fc:', 'Clap'),
  'emoji_u1f44f_1f3fd.tgs': (':noto_1f44f_1f3fd:', 'Clap'),
  'emoji_u1f44f_1f3fe.tgs': (':noto_1f44f_1f3fe:', 'Clap'),
  'emoji_u1f44f_1f3ff.tgs': (':noto_1f44f_1f3ff:', 'Clap'),
  'emoji_u1f450.tgs': (':open_hands:', 'Open Hands'),
  'emoji_u1f450_1f3fb.tgs': (':open_hands_1f450:', 'Open Hands'),
  'emoji_u1f450_1f3fc.tgs': (':noto_1f450_1f3fc:', 'Open Hands'),
  'emoji_u1f450_1f3fd.tgs': (':noto_1f450_1f3fd:', 'Open Hands'),
  'emoji_u1f450_1f3fe.tgs': (':noto_1f450_1f3fe:', 'Open Hands'),
  'emoji_u1f450_1f3ff.tgs': (':noto_1f450_1f3ff:', 'Open Hands'),
  'emoji_u1f451.tgs': (':crown_1f451:', 'Crown'),
  'emoji_u1f45f.tgs': (':running_shoe:', 'Running Shoe'),
  'emoji_u1f460.tgs': (':high_heeled_shoe:', 'High Heeled Shoe'),
  'emoji_u1f463.tgs': (':footprints:', 'Footprints'),
  'emoji_u1f479.tgs': (':ogre:', 'Ogre'),
  'emoji_u1f47b.tgs': (':ghost:', 'Ghost'),
  'emoji_u1f47d.tgs': (':alien:', 'Alien'),
  'emoji_u1f47e.tgs': (':alien_monster:', 'Alien Monster'),
  'emoji_u1f47f.tgs': (':imp_frown:', 'Imp Frown'),
  'emoji_u1f480.tgs': (':skull:', 'Skull'),
  'emoji_u1f483.tgs': (':dancer_woman:', 'Dancer Woman'),
  'emoji_u1f483_1f3fb.tgs': (':dancer_woman_1f483:', 'Dancer Woman'),
  'emoji_u1f483_1f3fc.tgs': (':noto_1f483_1f3fc:', 'Dancer Woman'),
  'emoji_u1f483_1f3fd.tgs': (':noto_1f483_1f3fd:', 'Dancer Woman'),
  'emoji_u1f483_1f3fe.tgs': (':noto_1f483_1f3fe:', 'Dancer Woman'),
  'emoji_u1f483_1f3ff.tgs': (':noto_1f483_1f3ff:', 'Dancer Woman'),
  'emoji_u1f485.tgs': (':nail_care:', 'Nail Care'),
  'emoji_u1f485_1f3fb.tgs': (':nail_care_1f485:', 'Nail Care'),
  'emoji_u1f485_1f3fc.tgs': (':noto_1f485_1f3fc:', 'Nail Care'),
  'emoji_u1f485_1f3fd.tgs': (':noto_1f485_1f3fd:', 'Nail Care'),
  'emoji_u1f485_1f3fe.tgs': (':noto_1f485_1f3fe:', 'Nail Care'),
  'emoji_u1f485_1f3ff.tgs': (':noto_1f485_1f3ff:', 'Nail Care'),
  'emoji_u1f48b.tgs': (':kiss:', 'Kiss'),
  'emoji_u1f48c.tgs': (':love_letter:', 'Love Letter'),
  'emoji_u1f48d.tgs': (':ring:', 'Ring'),
  'emoji_u1f48e.tgs': (':gem_stone:', 'Gem Stone'),
  'emoji_u1f490.tgs': (':bouquet:', 'Bouquet'),
  'emoji_u1f493.tgs': (':heartbeat:', 'Beating Heart'),
  'emoji_u1f494.tgs': (':broken_heart:', 'Broken Heart'),
  'emoji_u1f495.tgs': (':two_hearts:', 'Two Hearts'),
  'emoji_u1f496.tgs': (':sparkling_heart:', 'Sparkling Heart'),
  'emoji_u1f497.tgs': (':heart_grow:', 'Heart Grow'),
  'emoji_u1f498.tgs': (':cupid_1f498:', 'Cupid'),
  'emoji_u1f499.tgs': (':blue_heart:', 'Blue Heart'),
  'emoji_u1f49a.tgs': (':green_heart:', 'Green Heart'),
  'emoji_u1f49b.tgs': (':yellow_heart:', 'Yellow Heart'),
  'emoji_u1f49c.tgs': (':purple_heart:', 'Purple Heart'),
  'emoji_u1f49d.tgs': (':gift_heart:', 'Gift Heart'),
  'emoji_u1f49e.tgs': (':revolving_hearts:', 'Revolving Hearts'),
  'emoji_u1f49f.tgs': (':heart_box:', 'Heart Box'),
  'emoji_u1f4a1.tgs': (':light_bulb:', 'Light Bulb'),
  'emoji_u1f4a3.tgs': (':bomb:', 'Bomb'),
  'emoji_u1f4a5.tgs': (':boom:', 'Collision'),
  'emoji_u1f4a7.tgs': (':droplet:', 'Droplet'),
  'emoji_u1f4a9.tgs': (':poop:', 'Pile of Poo'),
  'emoji_u1f4aa.tgs': (':muscle:', 'Flexed Biceps'),
  'emoji_u1f4aa_1f3fb.tgs': (':flex:', 'Flex'),
  'emoji_u1f4aa_1f3fc.tgs': (':bicep:', 'Bicep'),
  'emoji_u1f4aa_1f3fd.tgs': (':strong:', 'Strong'),
  'emoji_u1f4aa_1f3fe.tgs': (':muscle_1f4aa:', 'Muscle'),
  'emoji_u1f4aa_1f3ff.tgs': (':noto_1f4aa_1f3ff:', 'Muscle'),
  'emoji_u1f4ac.tgs': (':speech_bubble:', 'Speech Bubble'),
  'emoji_u1f4af.tgs': (':100:', '100'),
  'emoji_u1f4b8.tgs': (':money_with_wings_1f4b8:', 'Money With Wings'),
  'emoji_u1f4bb.tgs': (':laptop_computer:', 'Laptop Computer'),
  'emoji_u1f4bf.tgs': (':optical_disk:', 'Optical Disk'),
  'emoji_u1f4c8.tgs': (':chart_increasing:', 'Chart Increasing'),
  'emoji_u1f4c9.tgs': (':chart_decreasing:', 'Chart Decreasing'),
  'emoji_u1f4ca.tgs': (':bar_chart:', 'Bar Chart'),
  'emoji_u1f4da.tgs': (':books_1f4da:', 'Books'),
  'emoji_u1f4df.tgs': (':pager:', 'Pager'),
  'emoji_u1f4e3.tgs': (':megaphone_1f4e3:', 'Megaphone'),
  'emoji_u1f4e6.tgs': (':package:', 'Package'),
  'emoji_u1f4f4.tgs': (':phone_off:', 'Phone Off'),
  'emoji_u1f4f7.tgs': (':camera:', 'Camera'),
  'emoji_u1f4f8.tgs': (':camera_flash:', 'Camera Flash'),
  'emoji_u1f4fa.tgs': (':television:', 'Television'),
  'emoji_u1f50b.tgs': (':battery_full:', 'Battery Full'),
  'emoji_u1f50c.tgs': (':electric_plug:', 'Electric Plug'),
  'emoji_u1f50e.tgs': (
    ':magnifying_glass_tilted_right:',
    'Magnifying Glass Tilted Right',
  ),
  'emoji_u1f512.tgs': (':locked:', 'Locked'),
  'emoji_u1f514.tgs': (':bell:', 'Bell'),
  'emoji_u1f525.tgs': (':burn:', 'Burn'),
  'emoji_u1f52e.tgs': (':crystal_ball_1f52e:', 'Crystal Ball'),
  'emoji_u1f54a_fe0f.tgs': (':peace:', 'Peace'),
  'emoji_u1f573_fe0f.tgs': (':hole:', 'Hole'),
  'emoji_u1f577_fe0f.tgs': (':spider:', 'Spider'),
  'emoji_u1f587_fe0f.tgs': (':linked_paperclips:', 'Linked Paperclips'),
  'emoji_u1f590_1f3fb.tgs': (':palm:', 'Palm'),
  'emoji_u1f590_1f3fc.tgs': (':palm_1f590:', 'Palm'),
  'emoji_u1f590_1f3fd.tgs': (':noto_1f590_1f3fd:', 'Palm'),
  'emoji_u1f590_1f3fe.tgs': (':noto_1f590_1f3fe:', 'Palm'),
  'emoji_u1f590_1f3ff.tgs': (':noto_1f590_1f3ff:', 'Palm'),
  'emoji_u1f590_fe0f.tgs': (':noto_1f590_fe0f:', 'Palm'),
  'emoji_u1f595.tgs': (':middle_finger:', 'Middle Finger'),
  'emoji_u1f595_1f3fb.tgs': (':middle_finger_1f595:', 'Middle Finger'),
  'emoji_u1f595_1f3fc.tgs': (':noto_1f595_1f3fc:', 'Middle Finger'),
  'emoji_u1f595_1f3fd.tgs': (':noto_1f595_1f3fd:', 'Middle Finger'),
  'emoji_u1f595_1f3fe.tgs': (':noto_1f595_1f3fe:', 'Middle Finger'),
  'emoji_u1f595_1f3ff.tgs': (':noto_1f595_1f3ff:', 'Middle Finger'),
  'emoji_u1f596.tgs': (':vulcan:', 'Vulcan'),
  'emoji_u1f596_1f3fb.tgs': (':prosper:', 'Prosper'),
  'emoji_u1f596_1f3fc.tgs': (':spock:', 'Spock'),
  'emoji_u1f596_1f3fd.tgs': (':vulcan_1f596:', 'Vulcan'),
  'emoji_u1f596_1f3fe.tgs': (':noto_1f596_1f3fe:', 'Vulcan'),
  'emoji_u1f596_1f3ff.tgs': (':noto_1f596_1f3ff:', 'Vulcan'),
  'emoji_u1f5a4.tgs': (':black_heart:', 'Black Heart'),
  'emoji_u1f5a8_fe0f.tgs': (':printer_1f5a8:', 'Printer'),
  'emoji_u1f5d1_fe0f.tgs': (':wastebasket:', 'Wastebasket'),
  'emoji_u1f5e3_fe0f.tgs': (':speaking_head_1f5e3:', 'Speaking Head'),
  'emoji_u1f5ef_fe0f.tgs': (':anger_bubble:', 'Anger Bubble'),
  'emoji_u1f5f3_fe0f.tgs': (':ballot_box_1f5f3:', 'Ballot Box'),
  'emoji_u1f5ff.tgs': (':moai:', 'Moai'),
  'emoji_u1f600.tgs': (':smile:', 'Grinning Face'),
  'emoji_u1f601.tgs': (':beaming_face:', 'Beaming Face With Smiling Eyes'),
  'emoji_u1f602.tgs': (':joy:', 'Face With Tears of Joy'),
  'emoji_u1f603.tgs': (':smiley:', 'Grinning Face With Big Eyes'),
  'emoji_u1f604.tgs': (':grin:', 'Grinning Face With Smiling Eyes'),
  'emoji_u1f605.tgs': (':sweat_smile:', 'Grinning Face With Sweat'),
  'emoji_u1f606.tgs': (':laughing:', 'Grinning Squinting Face'),
  'emoji_u1f607.tgs': (':halo:', 'Halo'),
  'emoji_u1f608.tgs': (':imp_smile:', 'Imp Smile'),
  'emoji_u1f609.tgs': (':wink:', 'Winking Face'),
  'emoji_u1f60a.tgs': (':blush:', 'Smiling Face With Smiling Eyes'),
  'emoji_u1f60b.tgs': (':yum:', 'Face Savoring Food'),
  'emoji_u1f60c.tgs': (':relieved:', 'Relieved'),
  'emoji_u1f60d.tgs': (':heart_eyes:', 'Smiling Face With Heart-Eyes'),
  'emoji_u1f60e.tgs': (':sunglasses_face:', 'Sunglasses Face'),
  'emoji_u1f60f.tgs': (':smirk:', 'Smirk'),
  'emoji_u1f610.tgs': (':neutral_face:', 'Neutral Face'),
  'emoji_u1f611.tgs': (':expressionless:', 'Expressionless'),
  'emoji_u1f612.tgs': (':unamused:', 'Unamused'),
  'emoji_u1f613.tgs': (':sweat:', 'Sweat'),
  'emoji_u1f614.tgs': (':pensive:', 'Pensive'),
  'emoji_u1f615.tgs': (':slightly_frowning:', 'Slightly Frowning'),
  'emoji_u1f616.tgs': (':scrunched_mouth:', 'Scrunched Mouth'),
  'emoji_u1f617.tgs': (':kissing:', 'Kissing'),
  'emoji_u1f618.tgs': (':kissing_heart:', 'Face Blowing a Kiss'),
  'emoji_u1f619.tgs': (':kissing_smiling_eyes:', 'Kissing Smiling Eyes'),
  'emoji_u1f61a.tgs': (':kissing_closed_eyes:', 'Kissing Closed Eyes'),
  'emoji_u1f61b.tgs': (':stuck_out_tongue:', 'Stuck Out Tongue'),
  'emoji_u1f61c.tgs': (':stuck_out_tongue_wink:', 'Winking Face With Tongue'),
  'emoji_u1f61d.tgs': (':squinting_tongue:', 'Squinting Tongue'),
  'emoji_u1f61e.tgs': (':sad:', 'Sad'),
  'emoji_u1f61f.tgs': (':worried:', 'Worried'),
  'emoji_u1f620.tgs': (':angry:', 'Angry Face'),
  'emoji_u1f621.tgs': (':rage:', 'Enraged Face'),
  'emoji_u1f622.tgs': (':cry:', 'Crying Face'),
  'emoji_u1f623.tgs': (':scrunched_eyes:', 'Scrunched Eyes'),
  'emoji_u1f624.tgs': (':triumph:', 'Face With Steam From Nose'),
  'emoji_u1f625.tgs': (':concerned:', 'Concerned'),
  'emoji_u1f626.tgs': (':gasp:', 'Gasp'),
  'emoji_u1f627.tgs': (':anguished:', 'Anguished'),
  'emoji_u1f628.tgs': (':scared:', 'Scared'),
  'emoji_u1f629.tgs': (':weary:', 'Weary'),
  'emoji_u1f62a.tgs': (':sleepy:', 'Sleepy'),
  'emoji_u1f62b.tgs': (':distraught:', 'Distraught'),
  'emoji_u1f62c.tgs': (':grimacing:', 'Grimacing Face'),
  'emoji_u1f62d.tgs': (':sob:', 'Loudly Crying Face'),
  'emoji_u1f62e.tgs': (':mouth_open:', 'Mouth Open'),
  'emoji_u1f62e_200d_1f4a8.tgs': (':exhale:', 'Exhale'),
  'emoji_u1f62f.tgs': (':surprised:', 'Surprised'),
  'emoji_u1f630.tgs': (':anxious_with_sweat:', 'Anxious With Sweat'),
  'emoji_u1f631.tgs': (':scream:', 'Face Screaming in Fear'),
  'emoji_u1f632.tgs': (':astonished:', 'Astonished'),
  'emoji_u1f633.tgs': (':flushed:', 'Flushed'),
  'emoji_u1f634.tgs': (':sleeping:', 'Sleeping Face'),
  'emoji_u1f635.tgs': (':x_eyes:', 'X Eyes'),
  'emoji_u1f635_200d_1f4ab.tgs': (':dizzy_face:', 'Dizzy Face'),
  'emoji_u1f636.tgs': (':mouth_none:', 'Mouth None'),
  'emoji_u1f636_200d_1f32b_fe0f.tgs': (':face_in_clouds:', 'Face In Clouds'),
  'emoji_u1f637.tgs': (':mask:', 'Mask'),
  'emoji_u1f638.tgs': (':smile_cat:', 'Smile Cat'),
  'emoji_u1f639.tgs': (':joy_cat:', 'Cat With Tears of Joy'),
  'emoji_u1f63a.tgs': (':smiley_cat:', 'Smiley Cat'),
  'emoji_u1f63b.tgs': (':heart_eyes_cat:', 'Smiling Cat With Heart-Eyes'),
  'emoji_u1f63c.tgs': (':smirk_cat:', 'Smirk Cat'),
  'emoji_u1f63d.tgs': (':kissing_cat:', 'Kissing Cat'),
  'emoji_u1f63e.tgs': (':pouting_cat:', 'Pouting Cat'),
  'emoji_u1f63f.tgs': (':crying_cat_face:', 'Crying Cat Face'),
  'emoji_u1f640.tgs': (':scream_cat:', 'Scream Cat'),
  'emoji_u1f641.tgs': (':frown:', 'Frown'),
  'emoji_u1f642.tgs': (':slightly_smiling_face:', 'Slightly Smiling Face'),
  'emoji_u1f642_200d_2194_fe0f.tgs': (':head_shake:', 'Head Shake'),
  'emoji_u1f642_200d_2195_fe0f.tgs': (':head_nod:', 'Head Nod'),
  'emoji_u1f643.tgs': (':upside_down_face:', 'Upside-Down Face'),
  'emoji_u1f644.tgs': (':roll_eyes:', 'Face With Rolling Eyes'),
  'emoji_u1f648.tgs': (':see_no_evil:', 'See-No-Evil Monkey'),
  'emoji_u1f649.tgs': (':hear_no_evil_monkey:', 'Hear No Evil Monkey'),
  'emoji_u1f64a.tgs': (':speak_no_evil_monkey:', 'Speak No Evil Monkey'),
  'emoji_u1f64c.tgs': (':raised_hands:', 'Raising Hands'),
  'emoji_u1f64c_1f3fb.tgs': (':raising_hands:', 'Raising Hands'),
  'emoji_u1f64c_1f3fc.tgs': (':hooray:', 'Hooray'),
  'emoji_u1f64c_1f3fd.tgs': (':raising_hands_1f64c:', 'Raising Hands'),
  'emoji_u1f64c_1f3fe.tgs': (':noto_1f64c_1f3fe:', 'Raising Hands'),
  'emoji_u1f64c_1f3ff.tgs': (':noto_1f64c_1f3ff:', 'Raising Hands'),
  'emoji_u1f64f.tgs': (':pray:', 'Folded Hands'),
  'emoji_u1f64f_1f3fb.tgs': (':folded_hands:', 'Folded Hands'),
  'emoji_u1f64f_1f3fc.tgs': (':please:', 'Please'),
  'emoji_u1f64f_1f3fd.tgs': (':hope:', 'Hope'),
  'emoji_u1f64f_1f3fe.tgs': (':wish:', 'Wish'),
  'emoji_u1f64f_1f3ff.tgs': (':thank_you:', 'Thank You'),
  'emoji_u1f680.tgs': (':rocket:', 'Rocket'),
  'emoji_u1f682.tgs': (':locomotive:', 'Locomotive'),
  'emoji_u1f68c.tgs': (':bus:', 'Bus'),
  'emoji_u1f695.tgs': (':taxi:', 'Taxi'),
  'emoji_u1f697.tgs': (':automobile:', 'Automobile'),
  'emoji_u1f69a.tgs': (':delivery_truck:', 'Delivery Truck'),
  'emoji_u1f69c.tgs': (':tractor:', 'Tractor'),
  'emoji_u1f6a6.tgs': (':vertical_traffic_light:', 'Vertical Traffic Light'),
  'emoji_u1f6a7.tgs': (':construction:', 'Construction'),
  'emoji_u1f6a8.tgs': (':police_car_light:', 'Police Car Light'),
  'emoji_u1f6a9.tgs': (':triangular_flag:', 'Triangular Flag'),
  'emoji_u1f6ae.tgs': (':litter:', 'Litter'),
  'emoji_u1f6b2.tgs': (':bicycle:', 'Bicycle'),
  'emoji_u1f6ce_fe0f.tgs': (':bellhop_bell:', 'Bellhop Bell'),
  'emoji_u1f6d1.tgs': (':stop_sign:', 'Stop Sign'),
  'emoji_u1f6d2.tgs': (':shopping_cart_1f6d2:', 'Shopping Cart'),
  'emoji_u1f6d8.tgs': (':debris:', 'Debris'),
  'emoji_u1f6df.tgs': (':ring_buoy:', 'Ring Buoy'),
  'emoji_u1f6e0_fe0f.tgs': (':hammer_and_wrench:', 'Hammer And Wrench'),
  'emoji_u1f6eb.tgs': (':airplane_departure:', 'Airplane Departure'),
  'emoji_u1f6ec.tgs': (':airplane_arrival:', 'Airplane Arrival'),
  'emoji_u1f6f6.tgs': (':canoe:', 'Canoe'),
  'emoji_u1f6f8.tgs': (':flying_saucer:', 'Flying Saucer'),
  'emoji_u1f6f9.tgs': (':skateboard:', 'Skateboard'),
  'emoji_u1f6fc.tgs': (':roller_skates:', 'Roller Skates'),
  'emoji_u1f90c.tgs': (':pinched_fingers:', 'Pinched Fingers'),
  'emoji_u1f90c_1f3fb.tgs': (':pinched_fingers_1f90c:', 'Pinched Fingers'),
  'emoji_u1f90c_1f3fc.tgs': (':noto_1f90c_1f3fc:', 'Pinched Fingers'),
  'emoji_u1f90c_1f3fd.tgs': (':noto_1f90c_1f3fd:', 'Pinched Fingers'),
  'emoji_u1f90c_1f3fe.tgs': (':noto_1f90c_1f3fe:', 'Pinched Fingers'),
  'emoji_u1f90c_1f3ff.tgs': (':noto_1f90c_1f3ff:', 'Pinched Fingers'),
  'emoji_u1f90d.tgs': (':white_heart:', 'White Heart'),
  'emoji_u1f90e.tgs': (':brown_heart:', 'Brown Heart'),
  'emoji_u1f90f.tgs': (':pinch:', 'Pinch'),
  'emoji_u1f90f_1f3fb.tgs': (':pinch_1f90f:', 'Pinch'),
  'emoji_u1f90f_1f3fc.tgs': (':noto_1f90f_1f3fc:', 'Pinch'),
  'emoji_u1f90f_1f3fd.tgs': (':noto_1f90f_1f3fd:', 'Pinch'),
  'emoji_u1f90f_1f3fe.tgs': (':noto_1f90f_1f3fe:', 'Pinch'),
  'emoji_u1f90f_1f3ff.tgs': (':noto_1f90f_1f3ff:', 'Pinch'),
  'emoji_u1f910.tgs': (':zipper_face:', 'Zipper Face'),
  'emoji_u1f911.tgs': (':money_mouth:', 'Money-Mouth Face'),
  'emoji_u1f912.tgs': (':thermometer_face:', 'Thermometer Face'),
  'emoji_u1f913.tgs': (':nerd_face:', 'Nerd Face'),
  'emoji_u1f914.tgs': (':thinking:', 'Thinking Face'),
  'emoji_u1f915.tgs': (':bandage_face:', 'Bandage Face'),
  'emoji_u1f916.tgs': (':robot_1f916:', 'Robot'),
  'emoji_u1f917.tgs': (':hugs:', 'Smiling Face With Open Hands'),
  'emoji_u1f918.tgs': (':metal:', 'Metal'),
  'emoji_u1f918_1f3fb.tgs': (':horns:', 'Horns'),
  'emoji_u1f918_1f3fc.tgs': (':metal_1f918:', 'Metal'),
  'emoji_u1f918_1f3fd.tgs': (':noto_1f918_1f3fd:', 'Metal'),
  'emoji_u1f918_1f3fe.tgs': (':noto_1f918_1f3fe:', 'Metal'),
  'emoji_u1f918_1f3ff.tgs': (':noto_1f918_1f3ff:', 'Metal'),
  'emoji_u1f919.tgs': (':call_me_hand:', 'Call Me Hand'),
  'emoji_u1f919_1f3fb.tgs': (':call_me_hand_1f919:', 'Call Me Hand'),
  'emoji_u1f919_1f3fc.tgs': (':noto_1f919_1f3fc:', 'Call Me Hand'),
  'emoji_u1f919_1f3fd.tgs': (':noto_1f919_1f3fd:', 'Call Me Hand'),
  'emoji_u1f919_1f3fe.tgs': (':noto_1f919_1f3fe:', 'Call Me Hand'),
  'emoji_u1f919_1f3ff.tgs': (':noto_1f919_1f3ff:', 'Call Me Hand'),
  'emoji_u1f91a.tgs': (':back_hand:', 'Back Hand'),
  'emoji_u1f91a_1f3fb.tgs': (':back_hand_1f91a:', 'Back Hand'),
  'emoji_u1f91a_1f3fc.tgs': (':noto_1f91a_1f3fc:', 'Back Hand'),
  'emoji_u1f91a_1f3fd.tgs': (':noto_1f91a_1f3fd:', 'Back Hand'),
  'emoji_u1f91a_1f3fe.tgs': (':noto_1f91a_1f3fe:', 'Back Hand'),
  'emoji_u1f91a_1f3ff.tgs': (':noto_1f91a_1f3ff:', 'Back Hand'),
  'emoji_u1f91b.tgs': (':fist_leftwards:', 'Fist Leftwards'),
  'emoji_u1f91b_1f3fb.tgs': (':fist_leftwards_1f91b:', 'Fist Leftwards'),
  'emoji_u1f91b_1f3fc.tgs': (':noto_1f91b_1f3fc:', 'Fist Leftwards'),
  'emoji_u1f91b_1f3fd.tgs': (':noto_1f91b_1f3fd:', 'Fist Leftwards'),
  'emoji_u1f91b_1f3fe.tgs': (':noto_1f91b_1f3fe:', 'Fist Leftwards'),
  'emoji_u1f91b_1f3ff.tgs': (':noto_1f91b_1f3ff:', 'Fist Leftwards'),
  'emoji_u1f91c.tgs': (':fist_rightwards:', 'Fist Rightwards'),
  'emoji_u1f91c_1f3fb.tgs': (':fist_rightwards_1f91c:', 'Fist Rightwards'),
  'emoji_u1f91c_1f3fc.tgs': (':noto_1f91c_1f3fc:', 'Fist Rightwards'),
  'emoji_u1f91c_1f3fd.tgs': (':noto_1f91c_1f3fd:', 'Fist Rightwards'),
  'emoji_u1f91c_1f3fe.tgs': (':noto_1f91c_1f3fe:', 'Fist Rightwards'),
  'emoji_u1f91c_1f3ff.tgs': (':noto_1f91c_1f3ff:', 'Fist Rightwards'),
  'emoji_u1f91d.tgs': (':handshake:', 'Handshake'),
  'emoji_u1f91d_1f3fb.tgs': (':handshake_1f91d:', 'Handshake'),
  'emoji_u1f91d_1f3fc.tgs': (':noto_1f91d_1f3fc:', 'Handshake'),
  'emoji_u1f91d_1f3fd.tgs': (':noto_1f91d_1f3fd:', 'Handshake'),
  'emoji_u1f91d_1f3fe.tgs': (':noto_1f91d_1f3fe:', 'Handshake'),
  'emoji_u1f91d_1f3ff.tgs': (':noto_1f91d_1f3ff:', 'Handshake'),
  'emoji_u1f91e.tgs': (':crossed_fingers:', 'Crossed Fingers'),
  'emoji_u1f91e_1f3fb.tgs': (':crossed_fingers_1f91e:', 'Crossed Fingers'),
  'emoji_u1f91e_1f3fc.tgs': (':noto_1f91e_1f3fc:', 'Crossed Fingers'),
  'emoji_u1f91e_1f3fd.tgs': (':noto_1f91e_1f3fd:', 'Crossed Fingers'),
  'emoji_u1f91e_1f3fe.tgs': (':noto_1f91e_1f3fe:', 'Crossed Fingers'),
  'emoji_u1f91e_1f3ff.tgs': (':noto_1f91e_1f3ff:', 'Crossed Fingers'),
  'emoji_u1f91f.tgs': (':love_you_gesture:', 'Love You Gesture'),
  'emoji_u1f91f_1f3fb.tgs': (':love_you_gesture_1f91f:', 'Love You Gesture'),
  'emoji_u1f91f_1f3fc.tgs': (':noto_1f91f_1f3fc:', 'Love You Gesture'),
  'emoji_u1f91f_1f3fd.tgs': (':noto_1f91f_1f3fd:', 'Love You Gesture'),
  'emoji_u1f91f_1f3fe.tgs': (':noto_1f91f_1f3fe:', 'Love You Gesture'),
  'emoji_u1f91f_1f3ff.tgs': (':noto_1f91f_1f3ff:', 'Love You Gesture'),
  'emoji_u1f920.tgs': (':cowboy:', 'Cowboy'),
  'emoji_u1f921.tgs': (':clown:', 'Clown'),
  'emoji_u1f922.tgs': (':sick:', 'Sick'),
  'emoji_u1f923.tgs': (':rofl:', 'Rolling on the Floor Laughing'),
  'emoji_u1f924.tgs': (':drool:', 'Drool'),
  'emoji_u1f925.tgs': (':liar:', 'Liar'),
  'emoji_u1f927.tgs': (':sneeze:', 'Sneeze'),
  'emoji_u1f928.tgs': (':raised_eyebrow:', 'Face With Raised Eyebrow'),
  'emoji_u1f929.tgs': (':star_struck:', 'Star-Struck'),
  'emoji_u1f92a.tgs': (':zany_face:', 'Zany Face'),
  'emoji_u1f92b.tgs': (':shushing_face:', 'Shushing Face'),
  'emoji_u1f92c.tgs': (':cursing_face:', 'Face With Symbols on Mouth'),
  'emoji_u1f92d.tgs': (':hand_over_mouth:', 'Face With Hand Over Mouth'),
  'emoji_u1f92e.tgs': (':vomit:', 'Vomit'),
  'emoji_u1f92f.tgs': (':exploding_head:', 'Exploding Head'),
  'emoji_u1f932.tgs': (':palms_up:', 'Palms Up'),
  'emoji_u1f932_1f3fb.tgs': (':palms_up_1f932:', 'Palms Up'),
  'emoji_u1f932_1f3fc.tgs': (':noto_1f932_1f3fc:', 'Palms Up'),
  'emoji_u1f932_1f3fd.tgs': (':noto_1f932_1f3fd:', 'Palms Up'),
  'emoji_u1f932_1f3fe.tgs': (':noto_1f932_1f3fe:', 'Palms Up'),
  'emoji_u1f932_1f3ff.tgs': (':noto_1f932_1f3ff:', 'Palms Up'),
  'emoji_u1f933.tgs': (':selfie:', 'Selfie'),
  'emoji_u1f933_1f3fb.tgs': (':selfie_1f933:', 'Selfie'),
  'emoji_u1f933_1f3fc.tgs': (':noto_1f933_1f3fc:', 'Selfie'),
  'emoji_u1f933_1f3fd.tgs': (':noto_1f933_1f3fd:', 'Selfie'),
  'emoji_u1f933_1f3fe.tgs': (':noto_1f933_1f3fe:', 'Selfie'),
  'emoji_u1f933_1f3ff.tgs': (':noto_1f933_1f3ff:', 'Selfie'),
  'emoji_u1f940.tgs': (':wilted_flower:', 'Wilted Flower'),
  'emoji_u1f941.tgs': (':drum:', 'Drum'),
  'emoji_u1f942.tgs': (':clinking_glasses:', 'Clinking Glasses'),
  'emoji_u1f947.tgs': (':gold_medal:', 'Gold Medal'),
  'emoji_u1f948.tgs': (':silver_medal:', 'Silver Medal'),
  'emoji_u1f949.tgs': (':bronze_medal:', 'Bronze Medal'),
  'emoji_u1f94b.tgs': (':martial_arts_uniform:', 'Martial Arts Uniform'),
  'emoji_u1f94d.tgs': (':lacrosse:', 'Lacrosse'),
  'emoji_u1f94e.tgs': (':softball:', 'Softball'),
  'emoji_u1f94f.tgs': (':flying_disc:', 'Flying Disc'),
  'emoji_u1f951.tgs': (':avocado:', 'Avocado'),
  'emoji_u1f952.tgs': (':cucumber:', 'Cucumber'),
  'emoji_u1f953.tgs': (':bacon:', 'Bacon'),
  'emoji_u1f954.tgs': (':potato:', 'Potato'),
  'emoji_u1f955.tgs': (':carrot:', 'Carrot'),
  'emoji_u1f957.tgs': (':green_salad:', 'Green Salad'),
  'emoji_u1f95d.tgs': (':kiwi_fruit:', 'Kiwi Fruit'),
  'emoji_u1f95e.tgs': (':pancakes:', 'Pancakes'),
  'emoji_u1f962.tgs': (':chopsticks:', 'Chopsticks'),
  'emoji_u1f966.tgs': (':broccoli:', 'Broccoli'),
  'emoji_u1f967.tgs': (':pie:', 'Pie'),
  'emoji_u1f968.tgs': (':pretzel:', 'Pretzel'),
  'emoji_u1f96c.tgs': (':leafy_green:', 'Leafy Green'),
  'emoji_u1f96d.tgs': (':mango:', 'Mango'),
  'emoji_u1f970.tgs': (
    ':smiling_face_with_three_hearts:',
    'Smiling Face With Hearts',
  ),
  'emoji_u1f971.tgs': (':yawn:', 'Yawn'),
  'emoji_u1f972.tgs': (':happy_cry:', 'Happy Cry'),
  'emoji_u1f973.tgs': (':partying_face:', 'Partying Face'),
  'emoji_u1f974.tgs': (':woozy:', 'Woozy'),
  'emoji_u1f975.tgs': (':hot_face:', 'Hot Face'),
  'emoji_u1f976.tgs': (':cold_face:', 'Cold Face'),
  'emoji_u1f978.tgs': (':disguise:', 'Disguise'),
  'emoji_u1f979.tgs': (':holding_back_tears:', 'Face Holding Back Tears'),
  'emoji_u1f97a.tgs': (':pleading_face:', 'Pleading Face'),
  'emoji_u1f980.tgs': (':crab:', 'Crab'),
  'emoji_u1f981.tgs': (':lion_face:', 'Lion Face'),
  'emoji_u1f982.tgs': (':scorpion:', 'Scorpion'),
  'emoji_u1f984.tgs': (':unicorn_1f984:', 'Unicorn'),
  'emoji_u1f985.tgs': (':eagle:', 'Eagle'),
  'emoji_u1f987.tgs': (':bat:', 'Bat'),
  'emoji_u1f988.tgs': (':shark:', 'Shark'),
  'emoji_u1f989.tgs': (':owl:', 'Owl'),
  'emoji_u1f98a.tgs': (':fox_face:', 'Fox Face'),
  'emoji_u1f98b.tgs': (':butterfly:', 'Butterfly'),
  'emoji_u1f98d.tgs': (':gorilla:', 'Gorilla'),
  'emoji_u1f98e.tgs': (':lizard:', 'Lizard'),
  'emoji_u1f994.tgs': (':hedgehog:', 'Hedgehog'),
  'emoji_u1f995.tgs': (':dinosaur:', 'Dinosaur'),
  'emoji_u1f996.tgs': (':t_rex:', 'T Rex'),
  'emoji_u1f997.tgs': (':cricket:', 'Cricket'),
  'emoji_u1f998.tgs': (':kangaroo:', 'Kangaroo'),
  'emoji_u1f99a.tgs': (':peacock:', 'Peacock'),
  'emoji_u1f99d.tgs': (':raccoon:', 'Raccoon'),
  'emoji_u1f99e.tgs': (':lobster:', 'Lobster'),
  'emoji_u1f99f.tgs': (':mosquito:', 'Mosquito'),
  'emoji_u1f9a0.tgs': (':virus:', 'Virus'),
  'emoji_u1f9a5.tgs': (':sloth:', 'Sloth'),
  'emoji_u1f9a6.tgs': (':otter:', 'Otter'),
  'emoji_u1f9a7.tgs': (':orangutan:', 'Orangutan'),
  'emoji_u1f9a9.tgs': (':flamingo:', 'Flamingo'),
  'emoji_u1f9ad.tgs': (':seal:', 'Seal'),
  'emoji_u1f9ae.tgs': (':guide_dog_1f9ae:', 'Guide Dog'),
  'emoji_u1f9b4.tgs': (':bone:', 'Bone'),
  'emoji_u1f9b5.tgs': (':leg:', 'Leg'),
  'emoji_u1f9b5_1f3fb.tgs': (':leg_1f9b5:', 'Leg'),
  'emoji_u1f9b5_1f3fc.tgs': (':noto_1f9b5_1f3fc:', 'Leg'),
  'emoji_u1f9b5_1f3fd.tgs': (':noto_1f9b5_1f3fd:', 'Leg'),
  'emoji_u1f9b5_1f3fe.tgs': (':noto_1f9b5_1f3fe:', 'Leg'),
  'emoji_u1f9b5_1f3ff.tgs': (':noto_1f9b5_1f3ff:', 'Leg'),
  'emoji_u1f9b6.tgs': (':foot:', 'Foot'),
  'emoji_u1f9b6_1f3fb.tgs': (':foot_1f9b6:', 'Foot'),
  'emoji_u1f9b6_1f3fc.tgs': (':noto_1f9b6_1f3fc:', 'Foot'),
  'emoji_u1f9b6_1f3fd.tgs': (':noto_1f9b6_1f3fd:', 'Foot'),
  'emoji_u1f9b6_1f3fe.tgs': (':noto_1f9b6_1f3fe:', 'Foot'),
  'emoji_u1f9b6_1f3ff.tgs': (':noto_1f9b6_1f3ff:', 'Foot'),
  'emoji_u1f9bb.tgs': (':hearing_aid:', 'Hearing Aid'),
  'emoji_u1f9bb_1f3fb.tgs': (':hearing_aid_1f9bb:', 'Hearing Aid'),
  'emoji_u1f9bb_1f3fc.tgs': (':noto_1f9bb_1f3fc:', 'Hearing Aid'),
  'emoji_u1f9bb_1f3fd.tgs': (':noto_1f9bb_1f3fd:', 'Hearing Aid'),
  'emoji_u1f9bb_1f3fe.tgs': (':noto_1f9bb_1f3fe:', 'Hearing Aid'),
  'emoji_u1f9bb_1f3ff.tgs': (':noto_1f9bb_1f3ff:', 'Hearing Aid'),
  'emoji_u1f9be.tgs': (':arm_mechanical:', 'Arm Mechanical'),
  'emoji_u1f9bf.tgs': (':leg_mechanical:', 'Leg Mechanical'),
  'emoji_u1f9c0.tgs': (':cheese_wedge:', 'Cheese Wedge'),
  'emoji_u1f9c2.tgs': (':salt:', 'Salt'),
  'emoji_u1f9c3.tgs': (':beverage_box:', 'Beverage Box'),
  'emoji_u1f9c4.tgs': (':garlic:', 'Garlic'),
  'emoji_u1f9c5.tgs': (':onion:', 'Onion'),
  'emoji_u1f9c9.tgs': (':mate:', 'Mate'),
  'emoji_u1f9cb.tgs': (':bubble_tea:', 'Bubble Tea'),
  'emoji_u1f9d0.tgs': (':monocle:', 'Monocle'),
  'emoji_u1f9e0.tgs': (':brain_1f9e0:', 'Brain'),
  'emoji_u1f9e1.tgs': (':orange_heart:', 'Orange Heart'),
  'emoji_u1f9e6.tgs': (':socks:', 'Socks'),
  'emoji_u1f9f9.tgs': (':broom:', 'Broom'),
  'emoji_u1fa70.tgs': (':ballet_shoes:', 'Ballet Shoes'),
  'emoji_u1fa75.tgs': (':light_blue_heart:', 'Light Blue Heart'),
  'emoji_u1fa76.tgs': (':grey_heart:', 'Grey Heart'),
  'emoji_u1fa77.tgs': (':pink_heart:', 'Pink Heart'),
  'emoji_u1fa78.tgs': (':blood:', 'Blood'),
  'emoji_u1fa7a.tgs': (':stethoscope_1fa7a:', 'Stethoscope'),
  'emoji_u1fa81.tgs': (':kite:', 'Kite'),
  'emoji_u1fa82.tgs': (':parachute:', 'Parachute'),
  'emoji_u1fa83.tgs': (':boomerang:', 'Boomerang'),
  'emoji_u1fa84.tgs': (':wand:', 'Wand'),
  'emoji_u1fa85.tgs': (':pi_ata:', 'Pi Ata'),
  'emoji_u1fa87.tgs': (':maracas:', 'Maracas'),
  'emoji_u1fa89.tgs': (':harp:', 'Harp'),
  'emoji_u1fa8a.tgs': (':trombone:', 'Trombone'),
  'emoji_u1fa8e.tgs': (':treasure:', 'Treasure'),
  'emoji_u1fa8f.tgs': (':shovel:', 'Shovel'),
  'emoji_u1fa90.tgs': (':ringed_planet:', 'Ringed Planet'),
  'emoji_u1fa94.tgs': (':diya_lamp:', 'Diya Lamp'),
  'emoji_u1fa95.tgs': (':banjo:', 'Banjo'),
  'emoji_u1fa99.tgs': (':coin_1fa99:', 'Coin'),
  'emoji_u1faa4.tgs': (':mouse_trap:', 'Mouse Trap'),
  'emoji_u1faa8.tgs': (':rock:', 'Rock'),
  'emoji_u1faa9.tgs': (':disco_ball:', 'Disco Ball'),
  'emoji_u1faab.tgs': (':battery_low:', 'Battery Low'),
  'emoji_u1faad.tgs': (':fan:', 'Fan'),
  'emoji_u1fab0.tgs': (':fly:', 'Fly'),
  'emoji_u1fab1.tgs': (':worm:', 'Worm'),
  'emoji_u1fab3.tgs': (':cockroach:', 'Cockroach'),
  'emoji_u1fab7.tgs': (':lotus:', 'Lotus'),
  'emoji_u1fabb.tgs': (':hyacinth:', 'Hyacinth'),
  'emoji_u1fabc.tgs': (':jellyfish:', 'Jellyfish'),
  'emoji_u1fabe.tgs': (':leafless_tree:', 'Leafless Tree'),
  'emoji_u1fabf.tgs': (':goose:', 'Goose'),
  'emoji_u1fac0.tgs': (':anatomical_heart:', 'Anatomical Heart'),
  'emoji_u1fac2.tgs': (':hugging:', 'Hugging'),
  'emoji_u1fac6.tgs': (':fingerprint:', 'Fingerprint'),
  'emoji_u1fac8.tgs': (':hairy_creature:', 'Hairy Creature'),
  'emoji_u1facd.tgs': (':orca:', 'Orca'),
  'emoji_u1facf.tgs': (':donkey:', 'Donkey'),
  'emoji_u1fad0.tgs': (':blueberries:', 'Blueberries'),
  'emoji_u1fad1.tgs': (':bell_pepper:', 'Bell Pepper'),
  'emoji_u1fad6.tgs': (':teapot:', 'Teapot'),
  'emoji_u1fad7.tgs': (':pour:', 'Pour'),
  'emoji_u1fad8.tgs': (':beans:', 'Beans'),
  'emoji_u1fada.tgs': (':ginger:', 'Ginger'),
  'emoji_u1fadb.tgs': (':pea_pod:', 'Pea Pod'),
  'emoji_u1fadc.tgs': (':root_vegetable:', 'Root Vegetable'),
  'emoji_u1fadf.tgs': (':splatter:', 'Splatter'),
  'emoji_u1fae0.tgs': (':melting_face:', 'Melting Face'),
  'emoji_u1fae1.tgs': (':salute:', 'Salute'),
  'emoji_u1fae2.tgs': (':hand_over_mouth_1fae2:', 'Hand Over Mouth'),
  'emoji_u1fae3.tgs': (':peeking:', 'Peeking'),
  'emoji_u1fae4.tgs': (':diagonal_mouth:', 'Diagonal Mouth'),
  'emoji_u1fae5.tgs': (':dotted_line_face:', 'Dotted Line Face'),
  'emoji_u1fae6.tgs': (':biting_lip:', 'Biting Lip'),
  'emoji_u1fae7.tgs': (':bubbles:', 'Bubbles'),
  'emoji_u1fae8.tgs': (':shaking_face:', 'Shaking Face'),
  'emoji_u1fae9.tgs': (':tired:', 'Tired'),
  'emoji_u1faea.tgs': (':distorted_face:', 'Distorted Face'),
  'emoji_u1faef.tgs': (':fight:', 'Fight'),
  'emoji_u1faf0.tgs': (
    ':hand_with_index_finger_and_thumb_crossed:',
    'Hand With Index Finger And Thumb Crossed',
  ),
  'emoji_u1faf0_1f3fb.tgs': (':snap:', 'Snap'),
  'emoji_u1faf0_1f3fc.tgs': (':finger_heart:', 'Finger Heart'),
  'emoji_u1faf0_1f3fd.tgs': (
    ':hand_with_index_finger_and_thumb_crossed_1faf0:',
    'Hand With Index Finger And Thumb Crossed',
  ),
  'emoji_u1faf0_1f3fe.tgs': (
    ':noto_1faf0_1f3fe:',
    'Hand With Index Finger And Thumb Crossed',
  ),
  'emoji_u1faf0_1f3ff.tgs': (
    ':noto_1faf0_1f3ff:',
    'Hand With Index Finger And Thumb Crossed',
  ),
  'emoji_u1faf1.tgs': (':rightwards_hand:', 'Rightwards Hand'),
  'emoji_u1faf1_1f3fb.tgs': (':rightwards_hand_1faf1:', 'Rightwards Hand'),
  'emoji_u1faf1_1f3fb_200d_1faf2_1f3fc.tgs': (':handshake_1faf1:', 'Handshake'),
  'emoji_u1faf1_1f3fb_200d_1faf2_1f3fd.tgs': (
    ':noto_1faf1_1f3fb_200d_1faf2_1f3fd:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fb_200d_1faf2_1f3fe.tgs': (
    ':noto_1faf1_1f3fb_200d_1faf2_1f3fe:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fb_200d_1faf2_1f3ff.tgs': (
    ':noto_1faf1_1f3fb_200d_1faf2_1f3ff:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fc.tgs': (':noto_1faf1_1f3fc:', 'Rightwards Hand'),
  'emoji_u1faf1_1f3fc_200d_1faf2_1f3fb.tgs': (
    ':noto_1faf1_1f3fc_200d_1faf2_1f3fb:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fc_200d_1faf2_1f3fd.tgs': (
    ':noto_1faf1_1f3fc_200d_1faf2_1f3fd:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fc_200d_1faf2_1f3fe.tgs': (
    ':noto_1faf1_1f3fc_200d_1faf2_1f3fe:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fc_200d_1faf2_1f3ff.tgs': (
    ':noto_1faf1_1f3fc_200d_1faf2_1f3ff:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fd.tgs': (':noto_1faf1_1f3fd:', 'Rightwards Hand'),
  'emoji_u1faf1_1f3fd_200d_1faf2_1f3fb.tgs': (
    ':noto_1faf1_1f3fd_200d_1faf2_1f3fb:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fd_200d_1faf2_1f3fc.tgs': (
    ':noto_1faf1_1f3fd_200d_1faf2_1f3fc:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fd_200d_1faf2_1f3fe.tgs': (
    ':noto_1faf1_1f3fd_200d_1faf2_1f3fe:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fd_200d_1faf2_1f3ff.tgs': (
    ':noto_1faf1_1f3fd_200d_1faf2_1f3ff:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fe.tgs': (':noto_1faf1_1f3fe:', 'Rightwards Hand'),
  'emoji_u1faf1_1f3fe_200d_1faf2_1f3fb.tgs': (
    ':noto_1faf1_1f3fe_200d_1faf2_1f3fb:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fe_200d_1faf2_1f3fc.tgs': (
    ':noto_1faf1_1f3fe_200d_1faf2_1f3fc:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fe_200d_1faf2_1f3fd.tgs': (
    ':noto_1faf1_1f3fe_200d_1faf2_1f3fd:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3fe_200d_1faf2_1f3ff.tgs': (
    ':noto_1faf1_1f3fe_200d_1faf2_1f3ff:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3ff.tgs': (':noto_1faf1_1f3ff:', 'Rightwards Hand'),
  'emoji_u1faf1_1f3ff_200d_1faf2_1f3fb.tgs': (
    ':noto_1faf1_1f3ff_200d_1faf2_1f3fb:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3ff_200d_1faf2_1f3fc.tgs': (
    ':noto_1faf1_1f3ff_200d_1faf2_1f3fc:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3ff_200d_1faf2_1f3fd.tgs': (
    ':noto_1faf1_1f3ff_200d_1faf2_1f3fd:',
    'Handshake',
  ),
  'emoji_u1faf1_1f3ff_200d_1faf2_1f3fe.tgs': (
    ':noto_1faf1_1f3ff_200d_1faf2_1f3fe:',
    'Handshake',
  ),
  'emoji_u1faf2.tgs': (':leftwards_hand:', 'Leftwards Hand'),
  'emoji_u1faf2_1f3fb.tgs': (':leftwards_hand_1faf2:', 'Leftwards Hand'),
  'emoji_u1faf2_1f3fc.tgs': (':noto_1faf2_1f3fc:', 'Leftwards Hand'),
  'emoji_u1faf2_1f3fd.tgs': (':noto_1faf2_1f3fd:', 'Leftwards Hand'),
  'emoji_u1faf2_1f3fe.tgs': (':noto_1faf2_1f3fe:', 'Leftwards Hand'),
  'emoji_u1faf2_1f3ff.tgs': (':noto_1faf2_1f3ff:', 'Leftwards Hand'),
  'emoji_u1faf3.tgs': (':palm_down:', 'Palm Down'),
  'emoji_u1faf3_1f3fb.tgs': (':drop:', 'Drop'),
  'emoji_u1faf3_1f3fc.tgs': (':palm_down_1faf3:', 'Palm Down'),
  'emoji_u1faf3_1f3fd.tgs': (':noto_1faf3_1f3fd:', 'Palm Down'),
  'emoji_u1faf3_1f3fe.tgs': (':noto_1faf3_1f3fe:', 'Palm Down'),
  'emoji_u1faf3_1f3ff.tgs': (':noto_1faf3_1f3ff:', 'Palm Down'),
  'emoji_u1faf4.tgs': (':palm_up:', 'Palm Up'),
  'emoji_u1faf4_1f3fb.tgs': (':throw:', 'Throw'),
  'emoji_u1faf4_1f3fc.tgs': (':palm_up_1faf4:', 'Palm Up'),
  'emoji_u1faf4_1f3fd.tgs': (':noto_1faf4_1f3fd:', 'Palm Up'),
  'emoji_u1faf4_1f3fe.tgs': (':noto_1faf4_1f3fe:', 'Palm Up'),
  'emoji_u1faf4_1f3ff.tgs': (':noto_1faf4_1f3ff:', 'Palm Up'),
  'emoji_u1faf5.tgs': (':pointing:', 'Pointing'),
  'emoji_u1faf5_1f3fb.tgs': (':pointing_1faf5:', 'Pointing'),
  'emoji_u1faf5_1f3fc.tgs': (':noto_1faf5_1f3fc:', 'Pointing'),
  'emoji_u1faf5_1f3fd.tgs': (':noto_1faf5_1f3fd:', 'Pointing'),
  'emoji_u1faf5_1f3fe.tgs': (':noto_1faf5_1f3fe:', 'Pointing'),
  'emoji_u1faf5_1f3ff.tgs': (':noto_1faf5_1f3ff:', 'Pointing'),
  'emoji_u1faf6.tgs': (':heart_hands:', 'Heart Hands'),
  'emoji_u1faf6_1f3fb.tgs': (':heart_hands_1faf6:', 'Heart Hands'),
  'emoji_u1faf6_1f3fc.tgs': (':noto_1faf6_1f3fc:', 'Heart Hands'),
  'emoji_u1faf6_1f3fd.tgs': (':noto_1faf6_1f3fd:', 'Heart Hands'),
  'emoji_u1faf6_1f3fe.tgs': (':noto_1faf6_1f3fe:', 'Heart Hands'),
  'emoji_u1faf6_1f3ff.tgs': (':noto_1faf6_1f3ff:', 'Heart Hands'),
  'emoji_u1faf7.tgs': (':push_leftwards:', 'Push Leftwards'),
  'emoji_u1faf7_1f3fb.tgs': (':push_leftwards_1faf7:', 'Push Leftwards'),
  'emoji_u1faf7_1f3fc.tgs': (':noto_1faf7_1f3fc:', 'Push Leftwards'),
  'emoji_u1faf7_1f3fd.tgs': (':noto_1faf7_1f3fd:', 'Push Leftwards'),
  'emoji_u1faf7_1f3fe.tgs': (':noto_1faf7_1f3fe:', 'Push Leftwards'),
  'emoji_u1faf7_1f3ff.tgs': (':noto_1faf7_1f3ff:', 'Push Leftwards'),
  'emoji_u1faf8.tgs': (':push_rightwards:', 'Push Rightwards'),
  'emoji_u1faf8_1f3fb.tgs': (':push_rightwards_1faf8:', 'Push Rightwards'),
  'emoji_u1faf8_1f3fc.tgs': (':noto_1faf8_1f3fc:', 'Push Rightwards'),
  'emoji_u1faf8_1f3fd.tgs': (':noto_1faf8_1f3fd:', 'Push Rightwards'),
  'emoji_u1faf8_1f3fe.tgs': (':noto_1faf8_1f3fe:', 'Push Rightwards'),
  'emoji_u1faf8_1f3ff.tgs': (':noto_1faf8_1f3ff:', 'Push Rightwards'),
  'emoji_u203c_fe0f.tgs': (':exclamation_double:', 'Exclamation Double'),
  'emoji_u2049_fe0f.tgs': (
    ':exclamation_question_mark:',
    'Exclamation Question Mark',
  ),
  'emoji_u2122_fe0f.tgs': (':trade_mark:', 'Trade Mark'),
  'emoji_u231b.tgs': (':hourglass_done:', 'Hourglass Done'),
  'emoji_u23f0.tgs': (':alarm_clock:', 'Alarm Clock'),
  'emoji_u23f3.tgs': (':hourglass_not_done:', 'Hourglass Not Done'),
  'emoji_u2601_fe0f.tgs': (':cloud:', 'Cloud'),
  'emoji_u2602_fe0f.tgs': (':umbrella:', 'Umbrella'),
  'emoji_u2603_fe0f.tgs': (':snowman_with_snow:', 'Snowman With Snow'),
  'emoji_u2604_fe0f.tgs': (':comet:', 'Comet'),
  'emoji_u2615.tgs': (':hot_beverage:', 'Hot Beverage'),
  'emoji_u261d_1f3fb.tgs': (':index_finger:', 'Index Finger'),
  'emoji_u261d_1f3fc.tgs': (':index_finger_261d:', 'Index Finger'),
  'emoji_u261d_1f3fd.tgs': (':noto_261d_1f3fd:', 'Index Finger'),
  'emoji_u261d_1f3fe.tgs': (':noto_261d_1f3fe:', 'Index Finger'),
  'emoji_u261d_1f3ff.tgs': (':noto_261d_1f3ff:', 'Index Finger'),
  'emoji_u261d_fe0f.tgs': (':noto_261d_fe0f:', 'Index Finger'),
  'emoji_u2622_fe0f.tgs': (':radioactive:', 'Radioactive'),
  'emoji_u2623_fe0f.tgs': (':biohazard:', 'Biohazard'),
  'emoji_u262e_fe0f.tgs': (':peace_symbol:', 'Peace Symbol'),
  'emoji_u262f_fe0f.tgs': (':yin_yang:', 'Yin Yang'),
  'emoji_u2639_fe0f.tgs': (':big_frown:', 'Big Frown'),
  'emoji_u263a_fe0f.tgs': (':warm_smile:', 'Warm Smile'),
  'emoji_u2648.tgs': (':aries:', 'Aries'),
  'emoji_u2649.tgs': (':taurus:', 'Taurus'),
  'emoji_u264a.tgs': (':gemini:', 'Gemini'),
  'emoji_u264b.tgs': (':cancer:', 'Cancer'),
  'emoji_u264c.tgs': (':leo:', 'Leo'),
  'emoji_u264d.tgs': (':virgo:', 'Virgo'),
  'emoji_u264e.tgs': (':libra:', 'Libra'),
  'emoji_u264f.tgs': (':scorpio:', 'Scorpio'),
  'emoji_u2650.tgs': (':sagittarius:', 'Sagittarius'),
  'emoji_u2651.tgs': (':capricorn:', 'Capricorn'),
  'emoji_u2652.tgs': (':aquarius:', 'Aquarius'),
  'emoji_u2653.tgs': (':pisces:', 'Pisces'),
  'emoji_u265f_fe0f.tgs': (':chess_pawn:', 'Chess Pawn'),
  'emoji_u2660_fe0f.tgs': (':spade:', 'Spade'),
  'emoji_u2665_fe0f.tgs': (':heart_2665:', 'Heart'),
  'emoji_u2668_fe0f.tgs': (':hot_springs:', 'Hot Springs'),
  'emoji_u267e_fe0f.tgs': (':infinity:', 'Infinity'),
  'emoji_u2693.tgs': (':anchor:', 'Anchor'),
  'emoji_u2696_fe0f.tgs': (':balance_scale:', 'Balance Scale'),
  'emoji_u2699_fe0f.tgs': (':gear:', 'Gear'),
  'emoji_u26a0_fe0f.tgs': (':warning:', 'Warning'),
  'emoji_u26a1.tgs': (':electricity:', 'Electricity'),
  'emoji_u26bd.tgs': (':soccer_ball:', 'Soccer Ball'),
  'emoji_u26be.tgs': (':baseball:', 'Baseball'),
  'emoji_u26c4.tgs': (':snowman:', 'Snowman'),
  'emoji_u26c5.tgs': (':partly_sunny_26c5:', 'Partly Sunny'),
  'emoji_u26ce.tgs': (':ophiuchus:', 'Ophiuchus'),
  'emoji_u26d3_fe0f.tgs': (':chains:', 'Chains'),
  'emoji_u26d3_fe0f_200d_1f4a5.tgs': (':broken_chain:', 'Broken Chain'),
  'emoji_u26f3.tgs': (':flag_in_hole:', 'Flag In Hole'),
  'emoji_u26f5.tgs': (':sailboat:', 'Sailboat'),
  'emoji_u26f8_fe0f.tgs': (':ice_skate:', 'Ice Skate'),
  'emoji_u26fd.tgs': (':fuel_pump:', 'Fuel Pump'),
  'emoji_u2702_fe0f.tgs': (':scissors:', 'Scissors'),
  'emoji_u2705.tgs': (':check_mark:', 'Check Mark'),
  'emoji_u2708_fe0f.tgs': (':airplane_2708:', 'Airplane'),
  'emoji_u270a.tgs': (':raised_fist:', 'Raised Fist'),
  'emoji_u270a_1f3fb.tgs': (':raised_fist_270a:', 'Raised Fist'),
  'emoji_u270a_1f3fc.tgs': (':noto_270a_1f3fc:', 'Raised Fist'),
  'emoji_u270a_1f3fd.tgs': (':noto_270a_1f3fd:', 'Raised Fist'),
  'emoji_u270a_1f3fe.tgs': (':noto_270a_1f3fe:', 'Raised Fist'),
  'emoji_u270a_1f3ff.tgs': (':noto_270a_1f3ff:', 'Raised Fist'),
  'emoji_u270b.tgs': (':raised_hand:', 'Raised Hand'),
  'emoji_u270b_1f3fb.tgs': (':raised_hand_270b:', 'Raised Hand'),
  'emoji_u270b_1f3fc.tgs': (':noto_270b_1f3fc:', 'Raised Hand'),
  'emoji_u270b_1f3fd.tgs': (':noto_270b_1f3fd:', 'Raised Hand'),
  'emoji_u270b_1f3fe.tgs': (':noto_270b_1f3fe:', 'Raised Hand'),
  'emoji_u270b_1f3ff.tgs': (':noto_270b_1f3ff:', 'Raised Hand'),
  'emoji_u270c_1f3fb.tgs': (':victory:', 'Victory'),
  'emoji_u270c_1f3fc.tgs': (':v:', 'V'),
  'emoji_u270c_1f3fd.tgs': (':peace_hand:', 'Peace Hand'),
  'emoji_u270c_1f3fe.tgs': (':victory_270c:', 'Victory'),
  'emoji_u270c_1f3ff.tgs': (':noto_270c_1f3ff:', 'Victory'),
  'emoji_u270c_fe0f.tgs': (':noto_270c_fe0f:', 'Victory'),
  'emoji_u270d_1f3fb.tgs': (':writing_hand_270d:', 'Writing Hand'),
  'emoji_u270d_1f3fc.tgs': (':noto_270d_1f3fc:', 'Writing Hand'),
  'emoji_u270d_1f3fd.tgs': (':noto_270d_1f3fd:', 'Writing Hand'),
  'emoji_u270d_1f3fe.tgs': (':noto_270d_1f3fe:', 'Writing Hand'),
  'emoji_u270d_1f3ff.tgs': (':noto_270d_1f3ff:', 'Writing Hand'),
  'emoji_u270d_fe0f.tgs': (':noto_270d_fe0f:', 'Writing Hand'),
  'emoji_u270f_fe0f.tgs': (':pencil:', 'Pencil'),
  'emoji_u2728.tgs': (':sparkles:', 'Sparkles'),
  'emoji_u2744_fe0f.tgs': (':snowflake:', 'Snowflake'),
  'emoji_u274c.tgs': (':cross_mark:', 'Cross Mark'),
  'emoji_u2753.tgs': (':question_mark:', 'Question Mark'),
  'emoji_u2757.tgs': (':exclamation_mark:', 'Exclamation Mark'),
  'emoji_u2763_fe0f.tgs': (
    ':heart_exclamation_point:',
    'Heart Exclamation Point',
  ),
  'emoji_u2764_fe0f.tgs': (':red_heart:', 'Red Heart'),
  'emoji_u2764_fe0f_200d_1f525.tgs': (':heart_on_fire:', 'Heart on Fire'),
  'emoji_u2764_fe0f_200d_1fa79.tgs': (':bandaged_heart:', 'Bandaged Heart'),
  'emoji_u2795.tgs': (':plus_sign:', 'Plus Sign'),
  'emoji_u2b50.tgs': (':star_2b50:', 'Star'),
  'emoji_ua9_fe0f.tgs': (':copyright:', 'Copyright'),
  'emoji_uae_fe0f.tgs': (':registered:', 'Registered'),
};

String _friendlyTitle(String packId) {
  switch (packId) {
    case 'Crocosaurus-1794222759141':
      return 'Crocosaurus';
    case 'HotCherry-1794222813220':
      return 'Hot Cherry';
    case 'HotHotHot-1794222825310':
      return 'Hot Hot Hot';
    case 'ViAndCaitlyn-1794222798837':
      return 'Vi & Caitlyn';
    case 'Topics-1794247486249':
      return 'Topics Emoji';
    case 'NotoEmoji':
      return 'Noto Emoji';
  }
  final dash = packId.indexOf('-');
  return dash > 0 ? packId.substring(0, dash) : packId;
}

class _Entry {
  _Entry(this.file, this.etag, this.bytesLen);
  final File file;
  final String etag;
  final int bytesLen;
  Uint8List? cached;
}

Future<void> main(List<String> args) async {
  var host = '127.0.0.1';
  var port = 8787;
  var delayMs = 0;
  var dirPath = 'example/assets/tgs';
  var includeAllTopics = false;

  for (var i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--host':
        if (i + 1 < args.length) host = args[++i];
      case '--port':
        if (i + 1 < args.length) port = int.parse(args[++i]);
      case '--delay-ms':
        if (i + 1 < args.length) delayMs = int.parse(args[++i]);
      case '--dir':
        if (i + 1 < args.length) dirPath = args[++i];
      case '--all-topics':
        includeAllTopics = true;
      case '--help':
        stdout.writeln(
          'Usage: dart run tool/tgs_server.dart '
          '[--host 127.0.0.1] [--port 8787] [--delay-ms 0] [--dir example/assets/tgs]',
        );
        return;
    }
  }

  final root = Directory(dirPath);
  if (!root.existsSync()) {
    stderr.writeln('Directory not found: ${root.absolute.path}');
    exitCode = 1;
    return;
  }

  final grouped = <String, List<File>>{};
  for (final entity in root.listSync(recursive: true, followLinks: false)) {
    if (entity is! File || !entity.path.endsWith('.tgs')) continue;
    final norm = entity.path.replaceAll('\\', '/');
    final parts = norm.split('/');
    if (parts.length < 2) continue;
    final pack = parts[parts.length - 2];
    final name = parts[parts.length - 1];
    if (pack.startsWith('Topics-') &&
        !includeAllTopics &&
        !_bundledTopics.contains(name)) {
      continue;
    }
    (grouped[pack] ??= []).add(entity);
  }

  final server = await HttpServer.bind(host, port);
  final baseUrl = 'http://$host:${server.port}';
  final packIds = grouped.keys.toList()..sort();
  final packsJson = <Map<String, dynamic>>[];
  final assets = <String, _Entry>{};
  final stickerOrderByPack = <List<String>>[];
  final topicEmojiOrder = <String>[];
  final otherEmojiOrder = <String>[];

  for (final packId in packIds) {
    final files = grouped[packId]!..sort((a, b) => a.path.compareTo(b.path));
    final isEmoji =
        packId.startsWith('Topics-') || packId.startsWith('NotoEmoji');
    final packTitle = _friendlyTitle(packId);
    final itemsJson = <Map<String, dynamic>>[];
    final ids = <String>[];
    for (var i = 0; i < files.length; i++) {
      final file = files[i];
      final bytes = file.readAsBytesSync();
      var hash = 0x811c9dc5;
      for (final b in bytes) {
        hash ^= b;
        hash = (hash * 0x01000193) & 0xFFFFFFFF;
      }
      final etag =
          '"${bytes.length.toRadixString(16)}-${hash.toRadixString(16)}"';
      final fileName = file.uri.pathSegments.last;
      final relPath = '/tgs/$packId/$fileName';
      final id = '$packId/$fileName';
      final meta = isEmoji
          ? (_topicMetaByFile[fileName] ?? _notoMetaByFile[fileName])
          : null;
      final shortcode = isEmoji ? (meta?.$1 ?? ':emoji_${i + 1}:') : null;
      final label = isEmoji
          ? (meta?.$2 ?? shortcode!.replaceAll(':', ''))
          : '$packTitle #${i + 1}';
      assets[relPath] = _Entry(file, etag, bytes.length)..cached = bytes;
      itemsJson.add(<String, dynamic>{
        'id': id,
        'packId': packId,
        'packTitle': packTitle,
        'fileName': fileName,
        'kind': isEmoji ? 'emoji' : 'sticker',
        'url': relPath,
        'bytes': bytes.length,
        'label': label,
        'shortcode': ?shortcode,
      });
      ids.add(id);
    }
    packsJson.add(<String, dynamic>{
      'id': packId,
      'title': packTitle,
      'kind': isEmoji ? 'emoji' : 'sticker',
      'items': itemsJson,
    });
    if (isEmoji) {
      if (packId.startsWith('Topics-')) {
        topicEmojiOrder.addAll(ids);
      } else {
        otherEmojiOrder.addAll(ids);
      }
    } else {
      stickerOrderByPack.add(ids);
    }
  }
  final emojiOrder = <String>[...topicEmojiOrder, ...otherEmojiOrder];

  final stickerOrder = <String>[];
  for (var row = 0; ; row++) {
    var found = false;
    for (final ids in stickerOrderByPack) {
      if (row < ids.length) {
        stickerOrder.add(ids[row]);
        found = true;
      }
    }
    if (!found) break;
  }

  final catalogBytes = utf8.encode(
    jsonEncode(<String, dynamic>{
      'baseUrl': baseUrl,
      'packs': packsJson,
      'stickerOrder': stickerOrder,
      'emojiOrder': emojiOrder,
    }),
  );

  var requests = 0;
  var tgsRequests = 0;
  var notModifiedResponses = 0;
  var abortedRequests = 0;
  var bytesServed = 0;

  stdout.writeln(
    'fastlottie TGS server listening on $baseUrl\n'
    '  Packs: ${packsJson.length} | Stickers: ${stickerOrder.length} | '
    'Emojis: ${emojiOrder.length} | Simulated delay: ${delayMs}ms\n'
    '  Android reverse tip: adb reverse tcp:${server.port} tcp:${server.port}\n'
    '  Flutter run flag:    --dart-define=TGS_SERVER_URL=$baseUrl',
  );

  late StreamSubscription<HttpRequest> sub;
  sub = server.listen((request) async {
    requests++;
    final path = request.uri.path;
    final response = request.response;
    response.headers.set('Access-Control-Allow-Origin', '*');

    try {
      if (path == '/health') {
        final payload = utf8.encode(
          jsonEncode(<String, dynamic>{
            'ok': true,
            'packs': packsJson.length,
            'stickers': stickerOrder.length,
            'emojis': emojiOrder.length,
            'requests': requests,
            'tgsRequests': tgsRequests,
            'notModifiedResponses': notModifiedResponses,
            'abortedRequests': abortedRequests,
            'bytesServed': bytesServed,
            'delayMs': delayMs,
          }),
        );
        response.headers.contentType = ContentType.json;
        response.contentLength = payload.length;
        response.add(payload);
        await response.close();
        return;
      }

      if (path == '/config') {
        final rawDelay = request.uri.queryParameters['delayMs'];
        final parsed = rawDelay == null ? null : int.tryParse(rawDelay);
        if (parsed != null && parsed >= 0) delayMs = parsed;
        final payload = utf8.encode(jsonEncode({'delayMs': delayMs}));
        response.headers.contentType = ContentType.json;
        response.contentLength = payload.length;
        response.add(payload);
        await response.close();
        return;
      }

      if (path == '/catalog') {
        response.headers.contentType = ContentType.json;
        response.contentLength = catalogBytes.length;
        response.add(catalogBytes);
        await response.close();
        stdout.writeln('[200] GET /catalog (${catalogBytes.length} B)');
        return;
      }

      final entry = assets[path];
      if (entry == null) {
        response.statusCode = HttpStatus.notFound;
        response.write('Not found: $path');
        await response.close();
        stdout.writeln('[404] GET $path');
        return;
      }

      if (delayMs > 0) {
        await Future<void>.delayed(Duration(milliseconds: delayMs));
      }

      final ifNoneMatch = request.headers.value(HttpHeaders.ifNoneMatchHeader);
      if (ifNoneMatch == entry.etag) {
        notModifiedResponses++;
        tgsRequests++;
        response.statusCode = HttpStatus.notModified;
        await response.close();
        stdout.writeln('[304] GET $path');
        return;
      }

      final bytes = entry.cached ??= await entry.file.readAsBytes();
      response.headers.set(
        HttpHeaders.contentTypeHeader,
        'application/x-tgsticker',
      );
      response.headers.set(HttpHeaders.etagHeader, entry.etag);
      response.headers.set(
        HttpHeaders.cacheControlHeader,
        'public, max-age=86400',
      );
      response.contentLength = bytes.length;
      response.add(bytes);
      await response.flush();
      await response.close();
      tgsRequests++;
      bytesServed += bytes.length;
      stdout.writeln(
        '[200] GET $path (${(bytes.length / 1024).toStringAsFixed(1)} KB)',
      );
    } on SocketException {
      abortedRequests++;
      stdout.writeln('[ABORT] $path (client closed socket)');
    } on HttpException {
      abortedRequests++;
      stdout.writeln('[ABORT] $path (http closed)');
    }
  });

  final sigDone = Completer<void>();
  late StreamSubscription<ProcessSignal> sigIntSub;
  sigIntSub = ProcessSignal.sigint.watch().listen((_) {
    if (!sigDone.isCompleted) sigDone.complete();
  });
  await sigDone.future;
  await sigIntSub.cancel();
  await sub.cancel();
  await server.close(force: true);
  stdout.writeln('\nServer stopped.');
}

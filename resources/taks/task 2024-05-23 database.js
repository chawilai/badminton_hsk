// 2024-05-23 15:00
    // - check file from AnimCJK
    //     - upload data to database
    //         - chinese
    //         - korea
//         - japanese
    // - check dictionaryZhHans and dictionaryZhHant
    //     - for the one that not match then merge to dictionanryZh
    // - check dictionary and dictionanryZh
    //     - for the one that not match then merge to dictionary ?
// -> base on dictionary make the function first then modify the data

2024-05-28 09:53 @home
    // - add layouts from Organic
    // - add Home page
    // - add menu dynamic
    // - add 404 page
    // - add animation and link
    // start the pinyin page
    //     - show all character
    //         - 10 at a time big one character can have animation using laravel pagination to fetch
    //         - show in table
    //         - add input for character search (filter)
    //             - using lodash to fetch
    //         - table detail
    //             - no
    //             - character -> svg big size -> CARD ?? not table
    //                 -> play animation
    //                 -> play sound
    //                 -> show pinyin
    //                 -> show meaning
    //                 -> more detail to show example sentence
// 2024-05-31 09:53 @home
    // -> add to list
    // -> floating cart for pinyin list
    //     -> click to show the list page
    //     -> the list can have function
    //         -> name
    //         -> show list
    //         -> show in write hanzi mode
    //             -> have to set number of slot -> maybe set default
    //         -> share list
    //             -> unique id

2024-06-01
// - add table of hanzi_list with name, reference, character list, character count,link
// - add share button to hanzi_list
// - add Practice Write button
//     - list all character in A4 Page with table
//     - add stroke number on Character
//     - add radical
//     - add grid structure
    // - add empty slot full 1 row or 2 rows -> maybe can set or
    //     - empty slot can draw using consent pad library
//     - can save ?? have to login
//     - add print button
//     - add go back button
        // - hidden button when print
        // - add more page for hanzi_list_writing
        //     - check if word % by 10 then add new page
        //     - pagination for hanzi_list_writing
        //     - add page number current/max page

2024-06-17 @roastniyom padad
    // - add socialmedia login -> google, line
        // - update users table
            // - add provider, provider1_id, profile_picture, link and merge email
        // - add env for secret
        // - add SocialMediaColtroller
        // - test and publis\[p];
    // - modify login layout -> GuestLayout
    // - modify dropdown menu for profile, login
    // - modify profile page
    // - modify users for collecting exp, level, range, location


2024-06-30 @home
    // - add words of all hsk to database 2024-07-14
    // - add page to list all word and meaning 2024-07-14
    - add youlish to listen the native speaker video -> free -> delete cookie if facing limit
    - add hanziwriter letter for the word
    - add sound for word
    - add hanzi writing print out form ?? for word ?? how ??
    - add flip card for word
    - add the combination of the word ??
        - nihao -> ni and hao

2024-07-14 @home-badroom
    - add quiz for flipcard hanzi
        - fetch hanzi to show flip card
        - random one of them to show on the top (show meaning)
        - add currectness to the array {
            hanzi: "ta",
            currect: false
        }
        - show the random word from set of the that currect is false
        - when flip the card currect update the currect value of the list
            - update the currect status
            - stay open the card
            - maybe change border to green
        - when flip the card wrong turn the card back in 5 second
            - maybe change border to red when flip up then change back to gray when flip back
        - when all list is open
            - notify finish show the complete card show new game select hsk1, hsk2, hsk3, animal, color ... and start game
            - update exp
            -


2024-07-05 @the_xym_cafe
    - badmintonparty
        - add laravel+inertia+vue
        - try to integrate vuetify
        - add art design ? repo







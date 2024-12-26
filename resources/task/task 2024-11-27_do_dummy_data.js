Wed 2024-11-27 17:56 @ILYSB

- let do it atleast draft
    - main function
        - create party that all user can join and work
            - have user table
                -> login using LINE with LINE OA



- Process
    -> Add LINE OA @badmintonparty
    -> Click menu Game/Party to enter LIFF web
    -> collect user_id to prepare for register
        -> if user_id not found then prompt to enter register form
            - already filled fields
                - name
                - picture profile
            - require fields
                - gender can set "not tell" ?? sweet male / tough girl
                - age can set "not tell"
                - badminton range
                    -> Beginner (N): อนุบาล -> ประถมต้น (1-3)
                    -> Intermediate (S): ประถมปลาย (4-6) -> มัธยมต้น
                    -> Advanced (P): มัธยมปลาย -> ปริญญาตรี
                    -> Professional (P+): ปริญญาโท -> ปริญญาเอก
                    -> Competitive (C): ระดับแข่งขันมืออาชีพ
table
    - users with line_id


@2024-12-11 09:00 @2nd room home

// - add users
    // - provider
    // - provider_id
    // - avatar
    // - profile_picture
    // - badminton_rank_id
    // - gender
    // - date_of_birth
// - add users fake data to factory

// - add badminton_rank table
    // - add fake data to factory

// - add party table
//     - id,


@2024-12-18 12:00 @2nd room home
    // - add button to create game
    // - add button to put player on the game
    //     - list all player in party
    //         - status of ready, break, done
    //         - in ready list add button of add to game on the back
    //         - add to game

    // - if add player to the game -> set game_status from 'ready' to 'setting'
    // - if remove player from the game -> set game_status from 'setting' to 'ready'
    // - if start the game -> set game_status from 'setting' to 'playing'
    //     - select field number -> press play
    //         - stamp game_start_date
    //         - set game_status to playing
    // - if the game is finished -> set game_status f rom 'playing' to 'break'
    //     - stamp game_finish_date
    //     - set game_status to break -> if set
    //     -> depend on party setting -> break after game finished = true
    // - if only set player team max = 2 in one team same game
    // - show player in game next line -> show user_id, age, range, team
    - show box of ready player, break, playing
        - maybe can choose player from ready and playing status to make game
            - depend on setting
                -> only ready
                -> ready, playing, break
    - show number of match played
    - show most play with player
    - show never play with player -> can add to the game

    // - add method to auto add play to the game -> do not have to balance yet
        // - look for the party_members status ready
        // - add to the provided game_id check if game double or quadruple then add player to the team1 and team2
        // - when add set player game_status to setting

    -> add to game -> status box ready -- or add break
        +++ switch player in and out game
            if drag player who not in the game (not switching) to replace player in the game
                - method gameSwitchPlayer(player1, player2)
                - check player who in the game (setting) = inGamePlayer / and who outGamePlayer
                    - inGamePlayer player update game_players id for outGamePlayer
                        -> replace user_id in game_players of that game_id
                        -> not delete
                        // -> set inGamePlayer game_status back to ready ?? already ready
                    // - outGamePlayer status ?? not change still ready
        +++ switch player in and in game (change team)
            if drag player who in the game team1 to replace player in the game (team2)
                - method gameSwitchTeam(player1, player2)
                - update player1 = player2 team
                - update player2 = player1 team
            // example

    // -> add game_shuttlecock to manage initial at game start, addition request, return after game
    //     - add new table game_shuttlecock
    //     - when game start add initial record (default 0)
    //     - add default in parties table and use it in game
    //     - addition request during the game
    //     - return shuttlecock after the game
        - show total shuttlecock used after the game finished
        - add input for setting in party main page
        - add in game initial input in game making section

    - add is_break_aftergame to parties to dynamic set player to break state not for making game
        // - add column is_break_aftergame to parties table default false
        // - add condition to finishGame method
        - add toggle in party main page

    - show the players in the game (2, 4) players
        - user_id
        - party_id
        - game_id
        - name
        - game_play_total
        - ranking
        - avatar
    - group ready
    - group break
    - group playing

    - add player friend
    - auto generate match
    - count the game play
    - start



    @2024-12-18 18:42 @2nd room home -> check flow

    - User
        - add user using LINE OA
        - set gender, date of birth, phone, name, badminton rank
        - credit balance ?
        - user table list
        - equiptment
    - Party
        - create party with initial setup
        - party setup modify
            - max player
            - court
            - start_time, end_time
            - play_date
            - condition to join -> age, gender, badminton rank
            - is_allow_reserve -> show 'ลงทะเบียนสำรอง' when party is full
            - reserve_spot -> show 'ลงทะเบียนสำรอง' when party is full
            - is_private
            - is_break_aftergame
        - add admin to manage party only Host can do
    - Game
        - Main page
            -> show summary
            -> create game button
            -> player list
        - Create Game big button -> with info
            - Auto matching button -> grap player to fill the current game with balancing the game
            - Create button to list game to the Game Dashboard
        - Show game dashboard with detail and status
            -> setting, listing, playing, finished
            -> button to Edit, Play, Finish game
            -> button to Edit, Delete game -> setting, listing Game Only
                -> create method for deleteGame
                    -> delete the game and game_player
            -> button to request shuttlecock -> Playing Game Only
            -> add field_number to the game when setting, listing

        - each game can be click to see popup to
            -> see game detail and Field display
            -> delete game -> status listing only
            -> modify game -> status listing only
            -> request addition shuttlecock
            -> set finished the game
        - Initial Shuttlecock -> default from party config -> can be add more
        -
    - Friend

    - Mist
        - badminton_ranks table
        - courts table


    @2024-12-19 11:55 @2nd room home -> check flow

    // - add confirm when try to add shuttlecock
    // - add confirm when try to listing
    // - add confirm when try to playing
    // - add confirm when try to finished game
    - setting game -> switch team of players in the game
    - setting game -> switch player out and in the game

    @2024-12-26 11:55 @2nd room home
    // - adjust table
    // - add avatar to table
    // - remove shuttlecock -> cannot below zero
    // - collapse all action and total playtime to last column
    // - add player team1 then team2
    - setup page
        - prompt to first setup page when no Badminton Setup
        - create setup page
        - when update setup redirect to parties list page

    - the parties list page
        - show big Button to create party
            - create party form
            - set password for join private party
                - private using password
                - private using link
                - private using scan qrcode
        - show all parties to the parties list page
        - set search party by uniqe id -> for private party
        - "join link" for private party
        - list party to the parties list page
            - party card info
                - court
                - party cover image -> default court image
                - max player
                - rank range
                - age, gender
                - shuttlecock
                - rule
                - price mode : total share, pay to play
                - initial price 50
                - game price 25
                - join party button
                    -> one player can join many party (maybe difference time)
                    -> joined party will how in profile
                        -> my parties table
                        -> up coming party card
                - share party button

    - the profile page
        -> personal info
        -> config -> show age, show profile to friend, show to public
            -> public info card example
                -> avatar
                -> name
                -> age
                -> gender
                -> badminton level
                -> badminton style ->
                    'Attacking/Offensive',
                    'Defensive',
                    'Control/Placement',
                    'Counter-Attacking',
                    'Deceptive',
                    'All-Rounder',
                    'Net-Dominant',
                    'Power-Based',
                    'Tactical',
                    'Slow-Paced/Patient',
                    'Speed Play'
                -> match played summary
                    -> double/quadruple
                    -> win/lose
                    -> most 10 play with and score -> have add friend button
                    -> most 10 play againt and score -> have add friend button
                    -> most 10 play with and win -> have add friend button
                    -> most 10 play againt and lose -> have add friend button
                -> motto
                -> game history
                -> friend list
        -> my parties table
        -> up coming party card

Thursday 2024-12-26 17:50 @ClubHouseUrbana

- finish main function of the app
    - login with LINE LIFF and LINE Login
    - Main Party List
        - Create Party Button
            - Create Party Form
        - List of Party for JOIN
            - Party Card with detail and JOIN Button
                - Can be set to private
                    - send invitation link
                    - enter passcode to join
    - party_play_field table
        - use for add field to play
            id, party_id, field_number, start_time, end_time
            (1, 1, 4, 19:00, 21:00) = 2 hour
            (2, 1, 5, 19:00, 20:00) = 1 hour
            (3, 1, 6, 20:00, 21:00) = 1 hour
            (4, 1, 7, 20:00, 21:00) = 1 hour
                summary     = 19-20 = 2 field
                            = 20-21 = 3 field
        ** set for TarangQ platform in the future **
    - party page
        - party info
            - for host/admin will see the hidden section
                - edit party info
                    - party name
                    - initial shuttlecock per game
                    - initial fee
                    - game/shuttlecock fee
                    - change player status
                    - setup
                        - is_private
                        - is_inc_playing
                        - is_break_aftergame
            - for member can set player status => ready, break, done

        - player list with info and status request to join and accept
        - start start party to create the game



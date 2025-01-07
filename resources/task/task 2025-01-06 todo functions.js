Monday 2025-01-06 18:47 @Home2nd

- what i have
    - new UI for create game
        - add listing section show player who are listing in the next game
    - game list that have to fix UI

- what to do
    - add function in Game List that 'finish'
        - add result button -> show only players who played that game
            -> popup for enter data
                - 1 show badminton court with filled player with
                    - game number on top
                    - start time, end time
                    - game duration
                    - shuttlecock used
                - 2 show set #1 result input and add set button (if have more that one set)
                    - show input (if which team have high score considered winner)
                        - team1 with avatar + name
                            - Score slider under it
                        - team2 with avatar + name
                            - Score slikder under it
                        - save button
    - login -> party list page -> create party button on top -> party list to join below
        - create party list button
            - big button on top of party page
            - click then show the dialog to create party
                - creator_id
                - play_date
                - court_id
                    -> select court from drop down court card
                        - image
                        - logo
                        - name
                - play_hours ?? no need just show the booking hour list
                - max_players -> have info popup for proper player numbers
                - start_time ?? use the the booking hour list that come first
                - end_time ?? use the the booking hour list that come last
                - status // Open, Full, Over
                - is_private
                    -> radio checkbox default is public
                    -> if set private show the password and link to join
                - is_inc_playing
                    -> default is False (when auto set game it will find player in playing also) -> disabled
                - is_break_aftergame
                    -> default is False (some court might set to True) if players have to notify to continue next game
                - default_initial_shuttlecocks
                    -> set to 0
                party condition
                - age_range default not set
                    -> if check to yes show min-max age input
                - gender default not set
                    -> if check to yes show allow gender check button
                - badminton_level default not set
                    -> if check to yes show min-max badminton level
                // - party_start_date
                // - party_end_date
                - court_booking_details -> comment
                - advertise text ?? short text for show to get attention
                - set play court add in line one by one -> add play court button (เพิ่มสนาม) มีตัวอย่างให้ดู
                    - start_time, end_time, field number -> show hours auto
                    - add copy button after the added line
                    example
                        -- 17:00-19:00 สนาม 1 -> 2 hours
                        -- 17:00-19:00 สนาม 2 -> 2 hours
                        -- 17:00-19:00 สนาม 3 -> 2 hours
                        -- 17:00-18:00 สนาม 4 -> 1 hours
                        -- 18:00-19:00 สนาม 5 -> 1 hours
                        -> play_time -> auto
                            ## party start_time 17:00
                            ## party end_time 19:00
                            ## 17:00-18:00 = 4 สนาม
                            ## 18:00-19:00 = 4 สนาม

                        -- 17:00-20:00 สนาม 1 -> 3 hours
                        -- 17:00-19:00 สนาม 2 -> 2 hours
                        -- 19:00-20:00 สนาม 3 -> 1 hours
                        -- 17:00-18:00 สนาม 4 -> 1 hours
                        -- 18:00-19:00 สนาม 5 -> 1 hours
                        -- 19:00-20:00 สนาม 6 -> 1 hours
                        -> play_time -> auto
                            ## party start_time 17:00
                            ## party end_time 20:00
                            ## 17:00-18:00 = 3 สนาม
                            ## 18:00-19:00 = 3 สนาม
                            ## 19:00-20:00 = 3 สนาม

                        -- 18:00-20:00 สนาม 1 -> 2 hours
                        -- 18:00-20:00 สนาม 2 -> 2 hours
                        -- 20:00-21:00 สนาม 1 -> 1 hours
                        -- 20:00-21:00 สนาม 2 -> 1 hours
                        -- 20:00-21:00 สนาม 5 -> 1 hours

                        same as

                        -- 18:00-21:00 สนาม 1 -> 3 hours
                        -- 18:00-21:00 สนาม 2 -> 3 hours
                        -- 20:00-21:00 สนาม 5 -> 1 hours

                        -> play_time -> auto
                            ## party start_time 18:00
                            ## party end_time 21:00
                            ## 18:00-19:00 = 2 สนาม
                            ## 19:00-20:00 = 2 สนาม
                            ## 20:00-21:00 = 3 สนาม
                // - created_at
                // - updated_at
                // - deleted_a


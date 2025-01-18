#2025-01-15 00:00 @home2nd

draft

- user info page
    - avatar image
    - avatar change image input -> save file from avatar link
    - name -> from LINE -> change name input

    - add birth day -> for age
    - add gender

    - motto
    - skill chart
    - body charactor boy/girl
    - play summary
        - Play 300 -> set (no record considered 1 set)
        - Win 50
        - Lose 100
        - no record -> set that not enter score -> show recomend to enter the score after game
        - most play with -> player
        - most play against -> player
        - most win with -> player
        - most lose against -> player
        - total meet player -> number of players that have been played togather on parties

    - latest party joined

    - activement

    - equipment ->
        - racket pick from list ? add new one
        - shoes pick from list
    - friends list
    - party history
    - game history

- party list page
    - create party button with popup form field
    - parties list for join

- Party Host config page
    - if the party belong to host host can see "manage" button to enter the main Party page
    - main party page show
        - party detail -> can click edit to show party form popup
        - players list for
            - confirm status
            - update player party name
                - add party_name after user_id in party_members
                - if this host create next party can pull party_members to fill the next party
                    - check last party looking for this user_id that have party_name and update the current party party_name
                - when display user name of party if there is no party_name then use the user.name
        - start party button ?? what point of it

#2025-01-09 10:00 @home2nd

// -- enter score popup
    // - add button for increase or decrease point value by 1 not over range 0-30
    // - add name label over the image
    // - add <hr> separate the set
    // - use text + raised button
    // - input number should be in 0 - 30 and only enter number
    // --- good enough ---
- user info page

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

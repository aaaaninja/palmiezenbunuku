module.exports = {
    resource: { maxSize: 50 * 1024 * 1024 },
    sites: [
        {
            url: 'https://www.nnn.ed.nico', // site URL
            accounts: {
                default: {
                    // ↑ account label
                    username: 'main', // or () => 'main'
                    password: 'password1',
                },
                sub: {
                    // ↑ account label
                    username: 'sub_account',
                    password: 'password2',
                },
            },
            login: [
                // [action, arg1, arg2, ...]
                [
                    'goto',
                    'https://www.nnn.ed.nico/oauth_login?next_url=https://www.nnn.ed.nico/home&target_type=niconico',
                ],
                [
                    'input',
                    'input#input__mailtel', // selector
                    '$username', // -> accounts.{ACCOUNT_LABEL}.username
                ],
                [
                    'input',
                    'input#input__password', // selector
                    '$password', // -> accounts.{ACCOUNT_LABEL}.password
                ],
                [
                    'submit',
                    'input#login__submit', // selector
                ],
            ],
        },
    ],
}

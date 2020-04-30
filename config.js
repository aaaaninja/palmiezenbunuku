module.exports = {
    resource: { maxSize: 50 * 1024 * 1024 },
    sites: [
        {
            url: 'https://www.palmie.jp', // site URL
            accounts: {
                default: {
                    // ↑ account label
                    username: process.env.DEF_USERNAME, // or () => 'main'
                    password: process.env.DEF_PASSWORD,
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
                    'https://www.palmie.jp/users/new',
                ],
                [
                    'click',
                    '.common-btn-pink', // selector
                ],
                [
                    'input',
                    'input#session_email', // selector
                    '$username', // -> accounts.{ACCOUNT_LABEL}.username
                ],
                [
                    'input',
                    'input#session_password', // selector
                    '$password', // -> accounts.{ACCOUNT_LABEL}.password
                ],
                [
                    'click',
                    '#main-body > div.popup-user-login-section > div > div > div.popup-user-login-content-inner > div.popup-user-form > form > div > button', // selector
                ],
            ],
        },
    ],
}

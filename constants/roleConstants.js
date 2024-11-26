const roleConstants = {
    read: [
        '/viewCounter'
    ],
    write:[
        "/createCounter",
        "/incrementCounter/:counterId",
        "/viewCounter"
    ],
    admin:[
        "/deleteCounter/:counterId",
        "/createIAMUser",
        "/createCounter",
        "/incrementCounter/:counterId"
    ]
}

module.exports = {roleConstants};
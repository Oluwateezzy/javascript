const users = [
    { username: "tobi", role: "admin" },
    { username: "ola", role: "user" },
    { username: "peace", role: "user" }
]

function isAuthorized(user) {
    if (user.role === "admin") {
        return true
    }
    return false
}

function isAuthenticated(username) {
    const user = users.find((value) =>
        value.username === username
    )
    if (user) return user
    else return false
}

function goToAdminDashboard() {
    console.log("Go to Admin dashboard")
}

function goToUserDashboard() {
    console.log("Go to User dashboard")
}

function middleWareHigerFn(isAuthenticatedFn, isAuthorizedFn, username) {
    const newUser = isAuthenticatedFn(username)

    if (newUser != false) {
        const isValid = isAuthorizedFn(newUser)
        if (isValid) {
            goToAdminDashboard()
        } else {
            goToUserDashboard()
        }
    }
}

middleWareHigerFn(isAuthenticated, isAuthorized, "tobi")
middleWareHigerFn(isAuthenticated, isAuthorized, "ola")
middleWareHigerFn(isAuthenticated, isAuthorized, "peace")
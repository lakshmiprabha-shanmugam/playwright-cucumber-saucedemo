export class LoginPage{

    constructor(page){
        this.page=page;
        this.usernameInput=page.getByPlaceholder("Username")
        this.passwordInput=page.getByPlaceholder("Password")
        this.loginButton=page.locator("#login-button")
        this.errorMessage=page.locator("h3[data-test='error']")     
    }

    async navigate(){

        await this.page.goto("https://www.saucedemo.com/", { waitUntil: 'domcontentloaded' })
    }
async login(username,password){      
     await this.usernameInput.fill(username)
     await this.passwordInput.fill(password)
     await this.loginButton.click()
}

}

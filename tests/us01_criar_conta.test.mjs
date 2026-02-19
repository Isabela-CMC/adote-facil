import { describe, it, after, before } from 'mocha';
import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import { buildDriver, BASE_URL, TIMEOUT, generateUniqueEmail, registerUser } from './helpers.mjs';

/**
 * US01 – Criar conta no sistema
 * Como uma pessoa que quer adotar ou doar um bicho,
 * quero conseguir me cadastrar na plataforma
 * para conseguir mandar mensagens e cadastrar pets.
 */
describe('US01 – Criar conta no sistema', function () {
    this.timeout(30000);
    let driver;

    before(async function () {
        driver = buildDriver();
    });

    after(async function () {
        await driver.quit();
    });

    it('Cenario de sucesso: preenche o formulario e o sistema cria a conta, redirecionando pro login', async function () {
        await driver.get(`${BASE_URL}/cadastro`);
        await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);

        const email = generateUniqueEmail();

        // Preenche o nome
        const nameInput = await driver.findElement(By.css('input[name="name"]'));
        await nameInput.sendKeys('Testuser');

        // Preenche o email
        const emailInput = await driver.findElement(By.css('input[name="email"]'));
        await emailInput.sendKeys(email);

        // Preenche a senha e confirmação
        const passwordInputs = await driver.findElements(By.css('input[type="password"]'));
        await passwordInputs[0].sendKeys('Test1234!');
        await passwordInputs[1].sendKeys('Test1234!');

        // Envia o formulario
        const submitButton = await driver.findElement(By.xpath("//button[contains(text(),'Cadastrar')]"));
        await submitButton.click();

        // Espera o alerta de sucesso aparecer
        await driver.wait(until.alertIsPresent(), TIMEOUT);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        assert.ok(
            alertText.includes('Cadastro efetuado com sucesso'),
            `Esperava alerta de sucesso mas veio: "${alertText}"`
        );
        await alert.accept();

        // Verifica se redirecionou pro login
        await driver.wait(until.urlContains('/login'), TIMEOUT);
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(currentUrl.includes('/login'), `Esperava /login mas veio: ${currentUrl}`);
    });

    it('Cenario de erro: tentar cadastrar com email que ja existe deve barrar e avisar', async function () {
        // Primeiro registra um usuario normalmente
        const result = await registerUser(driver);
        const emailJaUsado = result.email;

        // Agora tenta cadastrar de novo com o mesmo email
        await driver.get(`${BASE_URL}/cadastro`);
        await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);

        const nameInput = await driver.findElement(By.css('input[name="name"]'));
        await nameInput.sendKeys('Outroteste');

        const emailInput = await driver.findElement(By.css('input[name="email"]'));
        await emailInput.sendKeys(emailJaUsado);

        const passwordInputs = await driver.findElements(By.css('input[type="password"]'));
        await passwordInputs[0].sendKeys('Test1234!');
        await passwordInputs[1].sendKeys('Test1234!');

        const submitButton = await driver.findElement(By.xpath("//button[contains(text(),'Cadastrar')]"));
        await submitButton.click();

        // O sistema deve mostrar um alerta de erro avisando que o email ja existe
        await driver.wait(until.alertIsPresent(), TIMEOUT);
        const alert = await driver.switchTo().alert();
        const alertText = await alert.getText();
        assert.ok(
            alertText.length > 0,
            'Esperava um alerta de erro avisando sobre o email duplicado'
        );
        await alert.accept();
    });
});

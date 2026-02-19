import { describe, it, after, before } from 'mocha';
import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import { buildDriver, BASE_URL, TIMEOUT, registerUser, login } from './helpers.mjs';

/**
 * US03 – Procurar um pet pra adotar
 * Como alguem querendo um bicho de estimação,
 * quero usar os filtros de busca
 * pra achar mais rapido o tipo de animal que eu quero.
 */
describe('US03 – Procurar um pet para adotar', function () {
    this.timeout(60000);
    let driver;
    let testEmail;
    let testPassword;

    before(async function () {
        driver = buildDriver();

        // Registra e loga um usuario
        const result = await registerUser(driver);
        testEmail = result.email;
        testPassword = result.password;
    });

    after(async function () {
        await driver.quit();
    });

    it('Cenario de sucesso: seleciona filtro de tipo e a pagina atualiza mostrando so os que batem', async function () {
        await login(driver, testEmail, testPassword);

        // Navega pra pagina de animais disponiveis
        await driver.get(`${BASE_URL}/area_logada/animais_disponiveis`);
        await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);
        await driver.sleep(1500);

        // Clica no botão "Filtrar" pra abrir o dialog de filtros
        const filtrarButton = await driver.findElement(By.xpath("//button[contains(text(),'Filtrar')]"));
        await filtrarButton.click();
        await driver.sleep(500);

        // Seleciona o tipo "Cachorro" no select do dialog
        // O dialog abre com Radix UI, tem um select de tipo dentro
        const typeTrigger = await driver.wait(
            until.elementLocated(By.css('[role="dialog"] button[role="combobox"]')),
            TIMEOUT
        );
        await typeTrigger.click();
        await driver.sleep(500);

        // Clica na opção "Cachorro"
        const cachorroOption = await driver.wait(
            until.elementLocated(By.xpath("//div[@role='option']//span[text()='Cachorro']")),
            TIMEOUT
        );
        await cachorroOption.click();
        await driver.sleep(300);

        // Clica no botão "Filtrar" dentro do dialog pra aplicar o filtro
        const aplicarFiltro = await driver.findElement(By.xpath("//div[@role='dialog']//button[contains(text(),'Filtrar')]"));
        await aplicarFiltro.click();
        await driver.sleep(1500);

        // A pagina deve ter atualizado - verifica se ainda estamos na pagina certa
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes('/animais_disponiveis'),
            `Esperava continuar na pagina de animais disponiveis mas esta em: ${currentUrl}`
        );

        // Verifica se o filtro foi aplicado (deve ter botão "Limpar filtros" visivel)
        const pageSource = await driver.getPageSource();
        assert.ok(
            pageSource.includes('Limpar filtros'),
            'Esperava o botão "Limpar filtros" aparecer indicando que o filtro foi aplicado'
        );
    });

    it('Cenario de erro: filtrar por algo que nao tem no banco mostra que nao encontrou nada', async function () {
        await login(driver, testEmail, testPassword);

        // Navega pra pagina de animais disponiveis
        await driver.get(`${BASE_URL}/area_logada/animais_disponiveis`);
        await driver.wait(until.elementLocated(By.css('h1')), TIMEOUT);
        await driver.sleep(1500);

        // Clica no botão "Filtrar"
        const filtrarButton = await driver.findElement(By.xpath("//button[contains(text(),'Filtrar')]"));
        await filtrarButton.click();
        await driver.sleep(500);

        // Seleciona um tipo bem especifico que provavelmente nao tem nenhum resultado
        // Primeiro seleciona tipo "Peixe"
        const typeTrigger = await driver.wait(
            until.elementLocated(By.css('[role="dialog"] button[role="combobox"]')),
            TIMEOUT
        );
        await typeTrigger.click();
        await driver.sleep(500);

        const peixeOption = await driver.wait(
            until.elementLocated(By.xpath("//div[@role='option']//span[text()='Peixe']")),
            TIMEOUT
        );
        await peixeOption.click();
        await driver.sleep(300);

        // Preenche um nome bem especifico que nao vai existir no banco
        const nameInput = await driver.findElement(By.css('[role="dialog"] input[name="name"]'));
        await nameInput.sendKeys('AnimalInexistente99999');

        // Aplica o filtro
        const aplicarFiltro = await driver.findElement(By.xpath("//div[@role='dialog']//button[contains(text(),'Filtrar')]"));
        await aplicarFiltro.click();
        await driver.sleep(1500);

        // Deve mostrar a mensagem de que nao tem nenhum animal disponivelconst pageSource = await driver.getPageSource();
        const pageSource = await driver.getPageSource();
        assert.ok(
            pageSource.includes('não temos nenhum animal disponível') ||
            pageSource.includes('nenhum animal disponível para adoção'),
            'Esperava a mensagem de que nao encontrou nenhum animal'
        );
    });
});

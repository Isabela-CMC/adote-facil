import { describe, it, after, before } from 'mocha';
import assert from 'assert';
import { By, until } from 'selenium-webdriver';
import { buildDriver, BASE_URL, TIMEOUT, registerUser, login } from './helpers.mjs';

/**
 * US04 – Navegação pelo Menu Lateral e Logout
 * Como usuario logado,
 * quero navegar pelo menu lateral e conseguir sair da plataforma
 * pra acessar as diferentes funcionalidades e encerrar minha sessão.
 */
describe('US04 – Navegação e Logout', function () {
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

    it('Cenario de sucesso: navega por todas as paginas do menu lateral e verifica a URL', async function () {
        // Faz login primeiro
        await login(driver, testEmail, testPassword);

        const menuRoutes = [
            {
                label: 'Animais disponíveis para adoção',
                route: '/area_logada/animais_disponiveis',
            },
            {
                label: 'Disponibilizar animal para adoção',
                route: '/area_logada/disponibilizar_animal',
            },
            {
                label: 'Meus animais disponíveis para adoção',
                route: '/area_logada/meus_animais',
            },
            {
                label: 'Minhas conversas',
                route: '/area_logada/conversas',
            },
            {
                label: 'Editar dados pessoais',
                route: '/area_logada/editar_dados',
            },
        ];

        for (const menuItem of menuRoutes) {
            // Usa click via JavaScript pra evitar erro de ElementNotInteractable
            // nos itens duplicados do menu mobile que ta escondido
            await driver.executeScript(`
        const links = document.querySelectorAll('a');
        for (const link of links) {
          const span = link.querySelector('span');
          if (span && span.textContent.includes('${menuItem.label}')) {
            link.click();
            break;
          }
        }
      `);

            // Espera a URL mudar
            await driver.wait(until.urlContains(menuItem.route), TIMEOUT);
            const currentUrl = await driver.getCurrentUrl();
            assert.ok(
                currentUrl.includes(menuItem.route),
                `Esperava a URL conter "${menuItem.route}" mas veio: ${currentUrl}`
            );

            // Espera um pouco pro conteudo da pagina carregar
            await driver.sleep(500);
        }
    });

    it('Cenario de sucesso: faz logout e é redirecionado pro login', async function () {
        // Faz login primeiro
        await login(driver, testEmail, testPassword);

        // Clica em "Sair" usando JavaScript pra evitar problemas com duplicatas mobile/desktop
        await driver.executeScript(`
      const allSpans = document.querySelectorAll('span');
      for (const span of allSpans) {
        if (span.textContent.trim() === 'Sair') {
          span.closest('div').click();
          break;
        }
      }
    `);

        // Espera redirecionar pra /login
        await driver.wait(until.urlContains('/login'), TIMEOUT);
        const currentUrl = await driver.getCurrentUrl();
        assert.ok(
            currentUrl.includes('/login'),
            `Esperava /login apos logout mas veio: ${currentUrl}`
        );
    });
});

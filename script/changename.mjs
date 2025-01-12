import { Builder, By, until } from 'selenium-webdriver';
import chrome from 'selenium-webdriver/chrome.js';
import edge from 'selenium-webdriver/edge.js';
import firefox from 'selenium-webdriver/firefox.js';
import path from 'path';
import { expect } from 'chai';
import sleep from 'sleep-promise';

// Configuration paths for drivers
const __dirname = path.resolve();
const CHROME_DRIVER_PATH = path.join(__dirname, 'script', 'chromedriver.exe');
const EDGE_DRIVER_PATH = path.join(__dirname, 'script', 'msedgedriver.exe');
const FIREFOX_DRIVER_PATH = path.join(__dirname, 'script', 'geckodriver.exe');

// Base URL (set manually, no server start in the script)
let baseUrl = 'http://localhost:5050'; // Change this if needed

// Configure Chrome WebDriver
async function configureChromeDriver() {
    const options = new chrome.Options();
    options.addArguments('--headless', '--disable-gpu'); // removes the browser popup
    return new Builder().forBrowser('chrome').setChromeOptions(options).setChromeService(new chrome.ServiceBuilder(CHROME_DRIVER_PATH)).build();
}

async function configureEdgeDriver() {
    const options = new edge.Options();
    options.addArguments('--headless', '--disable-gpu');
    return new Builder().forBrowser('MicrosoftEdge').setEdgeOptions(options).setEdgeService(new edge.ServiceBuilder(EDGE_DRIVER_PATH)).build();
}

async function configureFirefoxDriver() {
    const options = new firefox.Options();
    options.addArguments('--headless', '--disable-gpu');
    options.setBinary('C:/Program Files/Mozilla Firefox/firefox.exe');
    return new Builder().forBrowser('firefox').setFirefoxOptions(options).setFirefoxService(new firefox.ServiceBuilder(FIREFOX_DRIVER_PATH)).build();
}


// Mocha Test Suite
describe('Student Management System', function () {
    this.timeout(30000);
    let driver;

    // Initialize driver before tests
    ['chrome', 'edge', 'firefox'].forEach((browserType) => {
    describe(`Using ${browserType}`, function() {
        before(async function() {
            try {
                if (browserType === 'chrome') {
                    driver = await configureChromeDriver();
                } else if (browserType === 'edge') {
                    driver = await configureEdgeDriver();
                } else if (browserType === 'firefox') {
                    driver = await configureFirefoxDriver();
                }
                await driver.get(baseUrl);
            } catch (error) {
                throw error;  // Re-throw to ensure Mocha registers the error
            }
        });

        after(async function() {
            try {
                if (driver) await driver.quit();
            } catch (error) {
                log.error(`Error tearing down ${browserType} driver: ${error}`);
            }
        });

        // Test Case: Update Student Name
        it('should go to Student Management and update the name field', async function() {
            

            // Step 1: Go to the homepage
            await driver.get(baseUrl);
            await sleep(5000);

            // Step 2: Navigate to the Student Management page
            const studentManagementLink = await driver.findElement(By.linkText('Go to Student Management'));
            await studentManagementLink.click();
            await sleep(5000);
            

            // Step 3: Click the Update button for the first student
            const updateButton = await driver.findElement(By.xpath("//button[contains(text(), 'Update')]"));
            await updateButton.click();

            // Step 4: Change the "name" field (assuming the "firstName" field is used)
            const firstNameInput = await driver.findElement(By.id('firstName'));
            await firstNameInput.clear();
            await firstNameInput.sendKeys('Updated Name');

            

            // Step 5: Submit the updated student information
            const submitButton = await driver.findElement(By.xpath("//button[contains(@class, 'submit-button')]"));
            await submitButton.click();
            

            await driver.wait(until.alertIsPresent(), 5000);  // Wait until the alert is present
        const alert = await driver.switchTo().alert();  // Switch to the alert
        const alertText = await alert.getText();  // Get the alert text
        expect(alertText).to.equal('Student updated successfully!');  // Verify the alert message
        await alert.accept();  // Accept (close) the alert
        });
    });
    });
    });

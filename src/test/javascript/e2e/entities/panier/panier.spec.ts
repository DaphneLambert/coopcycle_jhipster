import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { PanierComponentsPage, PanierDeleteDialog, PanierUpdatePage } from './panier.page-object';

const expect = chai.expect;

describe('Panier e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let panierComponentsPage: PanierComponentsPage;
  let panierUpdatePage: PanierUpdatePage;
  let panierDeleteDialog: PanierDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Paniers', async () => {
    await navBarPage.goToEntity('panier');
    panierComponentsPage = new PanierComponentsPage();
    await browser.wait(ec.visibilityOf(panierComponentsPage.title), 5000);
    expect(await panierComponentsPage.getTitle()).to.eq('myblogApp.panier.home.title');
    await browser.wait(ec.or(ec.visibilityOf(panierComponentsPage.entities), ec.visibilityOf(panierComponentsPage.noResult)), 1000);
  });

  it('should load create Panier page', async () => {
    await panierComponentsPage.clickOnCreateButton();
    panierUpdatePage = new PanierUpdatePage();
    expect(await panierUpdatePage.getPageTitle()).to.eq('myblogApp.panier.home.createOrEditLabel');
    await panierUpdatePage.cancel();
  });

  it('should create and save Paniers', async () => {
    const nbButtonsBeforeCreate = await panierComponentsPage.countDeleteButtons();

    await panierComponentsPage.clickOnCreateButton();

    await promise.all([
      panierUpdatePage.setNbElementsInput('5'),
      panierUpdatePage.setPriceInput('5'),
      // panierUpdatePage.contentSelectLastOption(),
      panierUpdatePage.compteSelectLastOption(),
      panierUpdatePage.restaurantSelectLastOption(),
    ]);

    expect(await panierUpdatePage.getNbElementsInput()).to.eq('5', 'Expected nbElements value to be equals to 5');
    expect(await panierUpdatePage.getPriceInput()).to.eq('5', 'Expected price value to be equals to 5');

    await panierUpdatePage.save();
    expect(await panierUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await panierComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Panier', async () => {
    const nbButtonsBeforeDelete = await panierComponentsPage.countDeleteButtons();
    await panierComponentsPage.clickOnLastDeleteButton();

    panierDeleteDialog = new PanierDeleteDialog();
    expect(await panierDeleteDialog.getDialogTitle()).to.eq('myblogApp.panier.delete.question');
    await panierDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(panierComponentsPage.title), 5000);

    expect(await panierComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

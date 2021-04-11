import { browser, ExpectedConditions as ec, promise } from 'protractor';
import { NavBarPage, SignInPage } from '../../page-objects/jhi-page-objects';

import { RolesComponentsPage, RolesDeleteDialog, RolesUpdatePage } from './roles.page-object';

const expect = chai.expect;

describe('Roles e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let rolesComponentsPage: RolesComponentsPage;
  let rolesUpdatePage: RolesUpdatePage;
  let rolesDeleteDialog: RolesDeleteDialog;
  const username = process.env.E2E_USERNAME ?? 'admin';
  const password = process.env.E2E_PASSWORD ?? 'admin';

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.autoSignInUsing(username, password);
    await browser.wait(ec.visibilityOf(navBarPage.entityMenu), 5000);
  });

  it('should load Roles', async () => {
    await navBarPage.goToEntity('roles');
    rolesComponentsPage = new RolesComponentsPage();
    await browser.wait(ec.visibilityOf(rolesComponentsPage.title), 5000);
    expect(await rolesComponentsPage.getTitle()).to.eq('myblogApp.roles.home.title');
    await browser.wait(ec.or(ec.visibilityOf(rolesComponentsPage.entities), ec.visibilityOf(rolesComponentsPage.noResult)), 1000);
  });

  it('should load create Roles page', async () => {
    await rolesComponentsPage.clickOnCreateButton();
    rolesUpdatePage = new RolesUpdatePage();
    expect(await rolesUpdatePage.getPageTitle()).to.eq('myblogApp.roles.home.createOrEditLabel');
    await rolesUpdatePage.cancel();
  });

  it('should create and save Roles', async () => {
    const nbButtonsBeforeCreate = await rolesComponentsPage.countDeleteButtons();

    await rolesComponentsPage.clickOnCreateButton();

    await promise.all([rolesUpdatePage.setRoleInput('role')]);

    expect(await rolesUpdatePage.getRoleInput()).to.eq('role', 'Expected Role value to be equals to role');

    await rolesUpdatePage.save();
    expect(await rolesUpdatePage.getSaveButton().isPresent(), 'Expected save button disappear').to.be.false;

    expect(await rolesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1, 'Expected one more entry in the table');
  });

  it('should delete last Roles', async () => {
    const nbButtonsBeforeDelete = await rolesComponentsPage.countDeleteButtons();
    await rolesComponentsPage.clickOnLastDeleteButton();

    rolesDeleteDialog = new RolesDeleteDialog();
    expect(await rolesDeleteDialog.getDialogTitle()).to.eq('myblogApp.roles.delete.question');
    await rolesDeleteDialog.clickOnConfirmButton();
    await browser.wait(ec.visibilityOf(rolesComponentsPage.title), 5000);

    expect(await rolesComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});

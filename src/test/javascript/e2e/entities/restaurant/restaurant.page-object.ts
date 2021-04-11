import { element, by, ElementFinder } from 'protractor';

export class RestaurantComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-restaurant div table .btn-danger'));
  title = element.all(by.css('jhi-restaurant div h2#page-heading span')).first();
  noResult = element(by.id('no-result'));
  entities = element(by.id('entities'));

  async clickOnCreateButton(): Promise<void> {
    await this.createButton.click();
  }

  async clickOnLastDeleteButton(): Promise<void> {
    await this.deleteButtons.last().click();
  }

  async countDeleteButtons(): Promise<number> {
    return this.deleteButtons.count();
  }

  async getTitle(): Promise<string> {
    return this.title.getAttribute('jhiTranslate');
  }
}

export class RestaurantUpdatePage {
  pageTitle = element(by.id('jhi-restaurant-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nameInput = element(by.id('field_name'));
  adressInput = element(by.id('field_adress'));

  ownedSelect = element(by.id('field_owned'));
  cooperativeSelect = element(by.id('field_cooperative'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNameInput(name: string): Promise<void> {
    await this.nameInput.sendKeys(name);
  }

  async getNameInput(): Promise<string> {
    return await this.nameInput.getAttribute('value');
  }

  async setAdressInput(adress: string): Promise<void> {
    await this.adressInput.sendKeys(adress);
  }

  async getAdressInput(): Promise<string> {
    return await this.adressInput.getAttribute('value');
  }

  async ownedSelectLastOption(): Promise<void> {
    await this.ownedSelect.all(by.tagName('option')).last().click();
  }

  async ownedSelectOption(option: string): Promise<void> {
    await this.ownedSelect.sendKeys(option);
  }

  getOwnedSelect(): ElementFinder {
    return this.ownedSelect;
  }

  async getOwnedSelectedOption(): Promise<string> {
    return await this.ownedSelect.element(by.css('option:checked')).getText();
  }

  async cooperativeSelectLastOption(): Promise<void> {
    await this.cooperativeSelect.all(by.tagName('option')).last().click();
  }

  async cooperativeSelectOption(option: string): Promise<void> {
    await this.cooperativeSelect.sendKeys(option);
  }

  getCooperativeSelect(): ElementFinder {
    return this.cooperativeSelect;
  }

  async getCooperativeSelectedOption(): Promise<string> {
    return await this.cooperativeSelect.element(by.css('option:checked')).getText();
  }

  async save(): Promise<void> {
    await this.saveButton.click();
  }

  async cancel(): Promise<void> {
    await this.cancelButton.click();
  }

  getSaveButton(): ElementFinder {
    return this.saveButton;
  }
}

export class RestaurantDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-restaurant-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-restaurant'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

import { element, by, ElementFinder } from 'protractor';

export class PanierComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-panier div table .btn-danger'));
  title = element.all(by.css('jhi-panier div h2#page-heading span')).first();
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

export class PanierUpdatePage {
  pageTitle = element(by.id('jhi-panier-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  nbElementsInput = element(by.id('field_nbElements'));
  priceInput = element(by.id('field_price'));

  contentSelect = element(by.id('field_content'));
  compteSelect = element(by.id('field_compte'));
  restaurantSelect = element(by.id('field_restaurant'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setNbElementsInput(nbElements: string): Promise<void> {
    await this.nbElementsInput.sendKeys(nbElements);
  }

  async getNbElementsInput(): Promise<string> {
    return await this.nbElementsInput.getAttribute('value');
  }

  async setPriceInput(price: string): Promise<void> {
    await this.priceInput.sendKeys(price);
  }

  async getPriceInput(): Promise<string> {
    return await this.priceInput.getAttribute('value');
  }

  async contentSelectLastOption(): Promise<void> {
    await this.contentSelect.all(by.tagName('option')).last().click();
  }

  async contentSelectOption(option: string): Promise<void> {
    await this.contentSelect.sendKeys(option);
  }

  getContentSelect(): ElementFinder {
    return this.contentSelect;
  }

  async getContentSelectedOption(): Promise<string> {
    return await this.contentSelect.element(by.css('option:checked')).getText();
  }

  async compteSelectLastOption(): Promise<void> {
    await this.compteSelect.all(by.tagName('option')).last().click();
  }

  async compteSelectOption(option: string): Promise<void> {
    await this.compteSelect.sendKeys(option);
  }

  getCompteSelect(): ElementFinder {
    return this.compteSelect;
  }

  async getCompteSelectedOption(): Promise<string> {
    return await this.compteSelect.element(by.css('option:checked')).getText();
  }

  async restaurantSelectLastOption(): Promise<void> {
    await this.restaurantSelect.all(by.tagName('option')).last().click();
  }

  async restaurantSelectOption(option: string): Promise<void> {
    await this.restaurantSelect.sendKeys(option);
  }

  getRestaurantSelect(): ElementFinder {
    return this.restaurantSelect;
  }

  async getRestaurantSelectedOption(): Promise<string> {
    return await this.restaurantSelect.element(by.css('option:checked')).getText();
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

export class PanierDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-panier-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-panier'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

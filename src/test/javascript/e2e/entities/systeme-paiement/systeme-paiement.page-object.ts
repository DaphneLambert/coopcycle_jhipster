import { element, by, ElementFinder } from 'protractor';

export class SystemePaiementComponentsPage {
  createButton = element(by.id('jh-create-entity'));
  deleteButtons = element.all(by.css('jhi-systeme-paiement div table .btn-danger'));
  title = element.all(by.css('jhi-systeme-paiement div h2#page-heading span')).first();
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

export class SystemePaiementUpdatePage {
  pageTitle = element(by.id('jhi-systeme-paiement-heading'));
  saveButton = element(by.id('save-entity'));
  cancelButton = element(by.id('cancel-save'));

  idInput = element(by.id('field_id'));
  methodInput = element(by.id('field_method'));

  agentsSelect = element(by.id('field_agents'));

  async getPageTitle(): Promise<string> {
    return this.pageTitle.getAttribute('jhiTranslate');
  }

  async setIdInput(id: string): Promise<void> {
    await this.idInput.sendKeys(id);
  }

  async getIdInput(): Promise<string> {
    return await this.idInput.getAttribute('value');
  }

  async setMethodInput(method: string): Promise<void> {
    await this.methodInput.sendKeys(method);
  }

  async getMethodInput(): Promise<string> {
    return await this.methodInput.getAttribute('value');
  }

  async agentsSelectLastOption(): Promise<void> {
    await this.agentsSelect.all(by.tagName('option')).last().click();
  }

  async agentsSelectOption(option: string): Promise<void> {
    await this.agentsSelect.sendKeys(option);
  }

  getAgentsSelect(): ElementFinder {
    return this.agentsSelect;
  }

  async getAgentsSelectedOption(): Promise<string> {
    return await this.agentsSelect.element(by.css('option:checked')).getText();
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

export class SystemePaiementDeleteDialog {
  private dialogTitle = element(by.id('jhi-delete-systemePaiement-heading'));
  private confirmButton = element(by.id('jhi-confirm-delete-systemePaiement'));

  async getDialogTitle(): Promise<string> {
    return this.dialogTitle.getAttribute('jhiTranslate');
  }

  async clickOnConfirmButton(): Promise<void> {
    await this.confirmButton.click();
  }
}

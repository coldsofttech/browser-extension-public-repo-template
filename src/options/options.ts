import { t, translateDocument } from '../shared/i18n';
import { getSettings, saveSettings } from '../shared/settings';

translateDocument();

const form = document.querySelector<HTMLFormElement>('#form');
const message = document.querySelector<HTMLInputElement>('#message');
const status = document.querySelector<HTMLElement>('#status');

if (message) {
  void getSettings().then((settings) => {
    message.value = settings.message;
  });
}

form?.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!message) return;
  void saveSettings({ message: message.value }).then((saved) => {
    message.value = saved.message;
    if (status) status.textContent = t('savedStatus');
  });
});

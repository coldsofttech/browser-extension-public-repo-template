import { getSettings, onSettingsChanged, type Settings } from '../shared/settings';
import { hideBanner, showBanner } from './banner';

function render(settings: Settings): void {
  if (settings.enabled) showBanner(document, settings.message);
  else hideBanner(document);
}

void getSettings().then(render);
onSettingsChanged(render);

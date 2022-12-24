import { Kekule, KekuleVue } from './kekule.vue.base.js';

let wrapWidgetConfigs = [
	{'widgetClassName': 'Kekule.ChemWidget.PeriodicTable'},
	{'widgetClassName': 'Kekule.ChemWidget.Viewer'},
	{'widgetClassName': 'Kekule.ChemWidget.Viewer2D'},
	{'widgetClassName': 'Kekule.ChemWidget.Viewer3D'},
	{'widgetClassName': 'Kekule.ChemWidget.SpectrumInspector'},
	{'widgetClassName': 'Kekule.ChemWidget.ChemObjInserter'},
	{'widgetClassName': 'Kekule.ChemWidget.SpectrumObjInserter'},
	{'widgetClassName': 'Kekule.Editor.Composer'}
];

function wrapWidgets()
{
	if (KekuleVue.Utils)
	{
		let compNamespace = KekuleVue;
		for (let i = 0, l = wrapWidgetConfigs.length; i < l; ++i)
		{
			var config = wrapWidgetConfigs[i];
			var widgetClass = Object.getCascadeFieldValue(config.widgetClassName, Kekule.$jsRoot);
			if (widgetClass)  // do wrap
			{
				var widgetShortName = Kekule.ClassUtils.getLastClassName(config.widgetClassName);
				var wrapper = KekuleVue.Utils.wrapWidget(widgetClass);
				compNamespace[widgetShortName] = wrapper;  // add to namespace
			}
		}
		return compNamespace;
	}
	else
	{
		return {};
	}
}

export default wrapWidgets();
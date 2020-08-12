import {createCustomElement, actionTypes} from '@servicenow/ui-core';
import snabbdom from '@servicenow/ui-renderer-snabbdom';
import "@servicenow/now-template-card";
import styles from './styles.scss';
import {createHttpEffect} from '@servicenow/ui-effect-http';


const {COMPONENT_BOOTSTRAPPED} = actionTypes;

const view = (states, {updateState}) => {
	const { result } = states;

	return (
		<div className="container">
			<h1>Incidents</h1>
			<div className="cards">
				{result.map(item=>

					<now-template-card-assist
						tagline={{icon: "tree-view-long-outline", label: 'Incident'}}
						actions={[
							{id: 'share', label: 'Copy URL'},
							{id: 'close', label: 'Delete'}
						]}

						heading={{label: item.short_description}}
						content={[
							{label: 'Number', value: item.number},
							{label: 'State', value: item.state},
							{label: 'Assignment Group', value: item.category},
							{label: 'Assigned To', value: item.assigned_to},				
						]}
						footer-content={{
							label: 'Updated',
							value: item.sys_updated_on
						}}
					/>

				)}
			
			</div>
		</div>
	)
};

createCustomElement('x-524540-incident-list', {
	actionHandlers: {
        [COMPONENT_BOOTSTRAPPED]: (coeffects) => {
			const { dispatch } = coeffects;
		
			dispatch('FETCH_LATEST_INCIDENT', {
				sysparm_limit: '1',
				sysparm_query: 'ORDERBYDESCnumber'
			});
		},
		'FETCH_LATEST_INCIDENT': createHttpEffect('api/now/table/incident?sysparm_display_value=true', {
			method: 'GET',
			queryParams: ['sysparm_limit','sysparm_query'],
			successActionType: 'FETCH_LATEST_INCIDENT_SUCCESS'
		}),
		'FETCH_LATEST_INCIDENT_SUCCESS': (coeffects) => {
			const { action, updateState } = coeffects;
			const { result } = action.payload;
					
			updateState({ result });
		}
    },
	renderer: {type: snabbdom},
	view,
	styles
});

import LayoutSwitch from 'app/components/presentational/LayoutSwitch';

import { connect } from 'react-redux';
import { compose, mapProps } from 'recompose';
import { isFeatureAvailable } from 'app/redux/modules';

export default compose(
    connect(
        (state, { feature, lampId }) => ({
            activeLayout: isFeatureAvailable(state, feature, lampId) ? 'yes' : 'no',
        }),
    ),
    mapProps(({ children, activeLayout }) => ({ activeLayout, layoutMap: { yes: children, no: null } })),
)(LayoutSwitch);

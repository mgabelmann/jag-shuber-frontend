import * as React from 'react'
import { Panel } from 'react-bootstrap'
import SheriffAbilityPile from '../../../components/SheriffAbilityPile'
import { SheriffAssignment } from '../../../api/index';

import AssignmentDragSource  from '../dragdrop/AssignmentDragSource';

export interface AssignmentCardProps {
    onClick?: () => void;
    assignment: SheriffAssignment;
    currentGroupId: number;
}

export default class AssignmentCard extends React.PureComponent<AssignmentCardProps, any>{
    render() {
        const { currentGroupId,assignment: { assignmentType, requiredAbilities, id, notes } } = this.props;

        return (
            <AssignmentDragSource id={id} currentGroupId={currentGroupId} >
                <Panel bsStyle="primary">
                    <h3>{assignmentType}</h3>
                    <h4>{notes}</h4>
                    <SheriffAbilityPile abilities={requiredAbilities} />
                </Panel>
            </AssignmentDragSource>
        )



    }
}


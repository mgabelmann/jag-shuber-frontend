import { connect } from 'react-redux';
import { updateSheriff } from '../modules/sheriffs/actions';
import dragSourceFactory from '../infrastructure/DragDrop/dragSourceFactory';
import ItemTypes from '../infrastructure/DragDrop/ItemTypes';

export interface DraggedSheriff {
    badgeNumer: number;
    onDuty: boolean;
}

export interface SheriffDropResult {
    dropEffect?: "copy" | "move";
    badgeNumber: number;
    onDuty: boolean;
}

interface AssignmentSourceFactoryProps {
    onDuty: boolean;
    badgeNumber: number;
    getDragData?: () => DraggedSheriff;
    endDrag?: (result?: SheriffDropResult) => void;
}

const AssignmentSourceFactory = dragSourceFactory<AssignmentSourceFactoryProps, DraggedSheriff, SheriffDropResult>(ItemTypes.SHERIFF);

const mapDispatchToProps = (dispatch: any, ownProps: AssignmentSourceFactoryProps) => {
    return {
        getDragData: (): DraggedSheriff => {
            return { badgeNumer: ownProps.badgeNumber, onDuty: ownProps.onDuty };
        },
        endDrag: (result?: SheriffDropResult) => {
            if (ownProps.endDrag) {
                ownProps.endDrag(result);
            }
            if (result) {
                const {dropEffect,...rest} = result;
                dispatch(updateSheriff(rest));
            }
        }
    }
}


export default connect<AssignmentSourceFactoryProps>(null, mapDispatchToProps)(AssignmentSourceFactory);

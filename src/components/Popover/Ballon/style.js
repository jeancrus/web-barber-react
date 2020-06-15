import styled from 'styled-components';
import Popover from '@material-ui/core/Popover';

export const BallonPopover = styled(Popover)`
    .MuiPaper-root {
        padding: 5px 0;
        box-shadow: none;
        overflow: visible;
        background-color: #ffffff00;
        .container {
            padding: 2px;
            background-color: white;
            min-width: 147px;
            box-shadow: 0 2px 14px 0 rgba(0, 0, 0, 0.19);

            ::before {
                content: '';
                height: 15px;
                width: 15px;
                position: absolute;
                top: -1px;
                transform: rotate(44deg);
                background: white;
                box-shadow: -3px -3px 6px -2px rgba(0, 0, 0, 0.14);
                left: 70px;
            }
        }
    }
`;

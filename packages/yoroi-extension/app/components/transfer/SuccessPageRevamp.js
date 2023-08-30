// @flow

import { observer } from 'mobx-react';
import { Component } from 'react';
import type { Node } from 'react';
import Dialog from '../widgets/Dialog';
import DialogCloseButton from '../widgets/DialogCloseButton';
import LoadingSpinner from '../widgets/LoadingSpinner';
import { Box, Typography } from '@mui/material';
import { ReactComponent as SuccessImg } from '../../assets/images/transfer-success.inline.svg';

type Props = {|
  +title: string,
  +text: string,
  +closeInfo?: {|
    +onClose: void => PossiblyAsync<void>,
    +closeLabel: string,
  |},
|};

@observer
export class SuccessPageRevamp extends Component<Props> {
  static defaultProps: {| closeInfo: void |} = {
    closeInfo: undefined,
  };

  render(): Node {
    const { title, closeInfo, text } = this.props;
    const actions =
      closeInfo == null
        ? undefined
        : [
            {
              label: this.props.closeInfo.closeLabel,
              onClick: this.props.closeInfo.onClose,
              primary: true,
            },
          ];

    return (
      <Dialog
        title={title}
        actions={actions}
        closeOnOverlayClick={false}
        onClose={closeInfo ? closeInfo.onClose : undefined}
        closeButton={closeInfo ? <DialogCloseButton /> : undefined}
      >
        <Box>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mb: '16px',
            }}
          >
            <SuccessImg />
          </Box>
          <Typography variant="body2" color="gray.900" textAlign="left" mt="4px">
            {text}
          </Typography>
          {this.props.closeInfo == null && <LoadingSpinner />}
        </Box>
      </Dialog>
    );
  }
}

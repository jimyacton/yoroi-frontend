// @flow
import React, { Component } from 'react';
import { observer } from 'mobx-react';
import classnames from 'classnames';
import { defineMessages, intlShape } from 'react-intl';
import SvgInline from 'react-svg-inline';

import globalMessages from '../../../../i18n/global-messages';
import LocalizableError from '../../../../i18n/LocalizableError';

import Dialog from '../../../widgets/Dialog';
import DialogCloseButton from '../../../widgets/DialogCloseButton';

import ProgressStepBlock from '../common/ProgressStepBlock';
// import HelpLinkBlock from './HelpLinkBlock';
import HWErrorBlock from '../common/HWErrorBlock';

import externalLinkSVG from '../../../../assets/images/link-external.inline.svg';
import aboutPrerequisiteIconSVG from '../../../../assets/images/hardware-wallet/about-prerequisite-header-icon.inline.svg';
import aboutPrerequisiteTrezorSVG from '../../../../assets/images/hardware-wallet/ledger/about.inline.svg';

import { ProgressInfo } from '../../../../types/HWConnectStoreTypes';

import styles from '../common/AboutDialog.scss';

const messages = defineMessages({
  aboutPrerequisite1Part1: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.1.part1',
    defaultMessage: '!!!Only Supports ',
    description: 'First Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
  aboutPrerequisite1Part2Link: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.1.part2.link',
    defaultMessage: '!!!https://www.ledger.com/products/ledger-nano-s',
    description: 'First Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
  aboutPrerequisite1Part2LinkText: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.1.part2.link.text',
    defaultMessage: '!!!Ledger Nano S',
    description: 'First Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
  aboutPrerequisite1Part3: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.1.part3',
    defaultMessage: '!!! model.',
    description: 'First Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
  aboutPrerequisite2: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.2.part2',
    defaultMessage: '!!!Cardano ADA app must be installed on the Ledger device.',
    description: 'Second Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
  aboutPrerequisite3: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.3',
    defaultMessage: '!!!Cardano ADA app must remain open on the Ledger device.',
    description: 'Third Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
  aboutPrerequisite5: {
    id: 'wallet.connect.ledger.dialog.step.about.prerequisite.5',
    defaultMessage: '!!!Trezor device must remain connected to the computer throughout the process',
    description: 'Fifth Prerequisite on the Connect to Ledger Hardware Wallet dialog.'
  },
});

type Props = {
  progressInfo: ProgressInfo,
  isActionProcessing: boolean,
  error: ?LocalizableError,
  submit: Function,
  cancel: Function,
};

@observer
export default class AboutDialog extends Component<Props> {

  static contextTypes = {
    intl: intlShape.isRequired
  };

  render() {
    const { intl } = this.context;
    const {
      progressInfo,
      isActionProcessing,
      error,
      submit,
      cancel
    } = this.props;

    const introBlock = (
      <div className={styles.headerBlock}>
        <span>{intl.formatMessage(globalMessages.hwConnectDialogAboutIntroTextLine1)}</span><br />
        <span>{intl.formatMessage(globalMessages.hwConnectDialogAboutIntroTextLine2)}</span><br />
        <span>{intl.formatMessage(globalMessages.hwConnectDialogAboutIntroTextLine3)}</span><br />
      </div>);

    const middleBlock = (
      <div className={classnames([styles.middleBlock, styles.middleAboutBlock])}>
        <div className={styles.prerequisiteBlock}>
          <div>
            <SvgInline svg={aboutPrerequisiteIconSVG} />
            <span className={styles.prerequisiteHeaderText}>
              {intl.formatMessage(globalMessages.hwConnectDialogAboutPrerequisiteHeader)}
            </span>
          </div>
          <ul>
            <li key="1">
              {intl.formatMessage(messages.aboutPrerequisite1Part1)}
              <a target="_blank" rel="noopener noreferrer" href={intl.formatMessage(messages.aboutPrerequisite1Part2Link)}>
                {intl.formatMessage(messages.aboutPrerequisite1Part2LinkText)}
                <SvgInline svg={externalLinkSVG} />
              </a>
              {intl.formatMessage(messages.aboutPrerequisite1Part3)}
            </li>
            <li key="2">{intl.formatMessage(messages.aboutPrerequisite2)}</li>
            <li key="3">{intl.formatMessage(messages.aboutPrerequisite3)}</li>
            <li key="4">{intl.formatMessage(globalMessages.hwConnectDialogAboutPrerequisite4)}</li>
            <li key="5">{intl.formatMessage(messages.aboutPrerequisite5)}</li>
          </ul>
        </div>
        <div className={styles.hwImageBlock}>
          <SvgInline svg={aboutPrerequisiteTrezorSVG} />
        </div>
      </div>);

    const dailogActions = [{
      className: isActionProcessing ? styles.processing : null,
      label: intl.formatMessage(globalMessages.nextButtonLabel),
      primary: true,
      disabled: false,
      onClick: submit,
    }];

    return (
      <Dialog
        className={classnames([styles.component, 'AboutDialog'])}
        title={intl.formatMessage(globalMessages.ledgerConnectAllDialogTitle)}
        actions={dailogActions}
        closeOnOverlayClick={false}
        closeButton={<DialogCloseButton />}
        onClose={cancel}
      >
        <ProgressStepBlock progressInfo={progressInfo} />
        {introBlock}
        {middleBlock}
        {/* <HelpLinkBlock progressInfo={progressInfo} /> */}
        <HWErrorBlock progressInfo={progressInfo} error={error} />
      </Dialog>);
  }
}

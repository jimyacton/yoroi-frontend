// @flow
import type { Node } from 'react';
import { Component } from 'react';
import { observer } from 'mobx-react';
import type { StoresAndActionsProps } from '../../types/injectedPropsType';
import TestnetWarningBanner from '../../components/topbar/banners/TestnetWarningBanner';
import ByronDeprecationBanner from './ByronDeprecationBanner';
import NotProductionBanner from '../../components/topbar/banners/NotProductionBanner';
import ServerErrorBanner from '../../components/topbar/banners/ServerErrorBanner';
import IncorrectTimeBanner from '../../components/topbar/banners/IncorrectTimeBanner';
import environment from '../../environment';
import { ServerStatusErrors } from '../../types/serverStatusErrorType';
import { isTestnet, isCardanoHaskell } from '../../api/ada/lib/storage/database/prepackaged/networks';
import { Bip44Wallet } from '../../api/ada/lib/storage/models/Bip44Wallet/wrapper';
import { getTokenName, genLookupOrFail } from '../../stores/stateless/tokenHelpers';
import { truncateToken } from '../../utils/formatters';

@observer
export default class BannerContainer extends Component<StoresAndActionsProps> {

  render(): Node {
    const serverStatus = this.props.stores.serverConnectionStore.checkAdaServerStatus;

    const { selected } = this.props.stores.wallets;
    const isWalletTestnet = selected == null
      ? false
      : isTestnet(selected.getParent().getNetworkInfo());

    const deprecationBanner = this.getDeprecationBanner();
    return (
      <>
        {/* if running in offline mode, don't render an error */}
        {this.props.stores.serverConnectionStore.serverTime != null && (
          <IncorrectTimeBanner
            serverTime={this.props.stores.serverConnectionStore.serverTime}
          />
        )}
        {serverStatus !== ServerStatusErrors.Healthy && (
          <ServerErrorBanner errorType={serverStatus} />
        )}
        <TestnetWarningBanner isTestnet={isWalletTestnet} />
        {!environment.isProduction() && <NotProductionBanner />}
        {deprecationBanner}
      </>
    );
  }

  getDeprecationBanner: void => Node = () => {
    const { selected } = this.props.stores.wallets;
    if (selected == null) {
      return null;
    }
    if (!isCardanoHaskell(selected.getParent().getNetworkInfo())) {
      return null;
    }
    if (!(selected.getParent() instanceof Bip44Wallet)) {
      return null;
    }
    const defaultToken = selected.getParent().getDefaultToken();
    const defaultTokenInfo = genLookupOrFail(this.props.stores.tokenInfoStore.tokenInfo)({
      identifier: defaultToken.defaultIdentifier,
      networkId: defaultToken.defaultNetworkId,
    });

    return (
      <ByronDeprecationBanner
        onUpgrade={undefined}
        ticker={truncateToken(getTokenName(defaultTokenInfo))}
      />
    );
  }
}

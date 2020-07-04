import { container } from 'tsyringe';

import IStorageProviders from '@shared/container/providers/StorageProviders/models/IStorageProviders';
import DiskStorageProvider from '@shared/container/providers/StorageProviders/implementations/DiskStorageProvider'

import IMailProviders from '@shared/container/providers/MailProviders/models/IMailProviders';
import EtherealMailProvider from '@shared/container/providers/MailProviders/implementations/EtherealMailProvider'



container.registerSingleton<IStorageProviders>(
  'DiskStorageProvider', DiskStorageProvider
  );

container.registerInstance<IMailProviders>(
  'MailProvider', new EtherealMailProvider()
  );



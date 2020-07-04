import { container } from 'tsyringe';

import IStorageProviders from '@shared/container/providers/StorageProviders/models/IStorageProviders';
import DiskStorageProvider from '@shared/container/providers/StorageProviders/implementations/DiskStorageProvider'


container.registerSingleton<IStorageProviders>(
  'DiskStorageProvider', DiskStorageProvider
  );



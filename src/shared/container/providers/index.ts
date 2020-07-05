import { container } from 'tsyringe';

import IStorageProviders from '@shared/container/providers/StorageProviders/models/IStorageProviders';
import DiskStorageProvider from '@shared/container/providers/StorageProviders/implementations/DiskStorageProvider'

import IMailProviders from '@shared/container/providers/MailProviders/models/IMailProviders';
import EtherealMailProvider from '@shared/container/providers/MailProviders/implementations/EtherealMailProvider'

import IMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/models/IMailTemplateProvider'
import HandlebarsMailTemplateProvider from '@shared/container/providers/MailTemplateProvider/implementations/HandlebarsMailTemplateProvider'



container.registerSingleton<IStorageProviders>(
  'DiskStorageProvider', DiskStorageProvider
  );

container.registerSingleton<IMailTemplateProvider>(
  'MailTemplateProvider', HandlebarsMailTemplateProvider
  );

  container.registerInstance<IMailProviders>(
    'MailProvider', container.resolve(EtherealMailProvider)
    );


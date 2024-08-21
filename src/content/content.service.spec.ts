import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import {
  METADATA_STORAGE,
  MetadataStorage,
} from './interfaces/metadata-storage.interface';
import {
  CONTENT_STORAGE,
  ContentStorage,
} from './interfaces/content-storage.interface';
import { NotFoundError } from 'src/common/errors/not-found.error';
import * as uuid from 'uuid';
import { File } from 'src/upload/file';

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('ContentService', () => {
  let service: ContentService;
  let metadataStorage: MetadataStorage;
  let contentStorage: ContentStorage;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        {
          provide: METADATA_STORAGE,
          useValue: {
            findVersions: jest.fn(),
            findOne: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: CONTENT_STORAGE,
          useValue: {
            save: jest.fn(),
            downloadUrl: jest.fn(),
            getOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
    metadataStorage = module.get<MetadataStorage>(METADATA_STORAGE);
    contentStorage = module.get<ContentStorage>(CONTENT_STORAGE);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findVersions', () => {
    it('should return an array of content versions', async () => {
      const result = [{ id: '1', version: 1, createdAt: new Date() }];
      jest.spyOn(metadataStorage, 'findVersions').mockResolvedValue(result);

      expect(
        await service.findVersions({ id: '1', limit: 10, skip: 0 }),
      ).toEqual(result);
    });

    it('should return an empty array if no versions found', async () => {
      jest.spyOn(metadataStorage, 'findVersions').mockResolvedValue([]);
      expect(
        await service.findVersions({ id: '1', limit: 10, skip: 0 }),
      ).toEqual([]);
    });

    it('should throw an error if storage fails', async () => {
      jest
        .spyOn(metadataStorage, 'findVersions')
        .mockRejectedValue(new Error('Storage error'));

      await expect(
        service.findVersions({ id: '1', limit: 10, skip: 0 }),
      ).rejects.toThrow('Storage error');
    });
  });

  describe('findOne', () => {
    it('should return content when found', async () => {
      const metadata = { title: 'Test', version: 1, createdAt: new Date() };
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(metadata);
      jest
        .spyOn(contentStorage, 'downloadUrl')
        .mockResolvedValue('http://example.com/file');

      expect(await service.findOne({ id: '1', version: 1 })).toEqual({
        id: '1',
        title: 'Test',
        version: 1,
        url: 'http://example.com/file',
        createdAt: metadata.createdAt,
      });
    });

    it('should throw NotFoundError when content not found', async () => {
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(null);

      await expect(service.findOne({ id: '1', version: 1 })).rejects.toThrow(
        NotFoundError,
      );
    });

    it('should handle downloadUrl failure gracefully', async () => {
      const metadata = { title: 'Test', version: 1, createdAt: new Date() };
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(metadata);
      jest
        .spyOn(contentStorage, 'downloadUrl')
        .mockRejectedValue(new Error('Download failed'));

      await expect(service.findOne({ id: '1', version: 1 })).rejects.toThrow(
        'Download failed',
      );
    });
  });

  describe('create', () => {
    it('should create and return content', async () => {
      const file = new File('image/png', jest.fn() as any);
      const id = 'mocked-uuid';
      (uuid.v4 as jest.Mock).mockReturnValue(id);
      const createdAt = new Date();
      jest.spyOn(contentStorage, 'save').mockResolvedValue(void 0);
      jest.spyOn(metadataStorage, 'save').mockResolvedValue(void 0);
      jest
        .spyOn(contentStorage, 'downloadUrl')
        .mockResolvedValue('http://example.com/file');

      const result = await service.create('Test Title', file);

      expect(result).toEqual({
        id,
        title: 'Test Title',
        url: 'http://example.com/file',
        version: 1,
        createdAt,
      });
    });

    it('should throw an error if content storage fails', async () => {
      const file = new File('image/png', jest.fn() as any);
      const id = 'mocked-uuid';
      (uuid.v4 as jest.Mock).mockReturnValue(id);
      jest
        .spyOn(contentStorage, 'save')
        .mockRejectedValue(new Error('Storage failed'));

      await expect(service.create('Test Title', file)).rejects.toThrow(
        'Storage failed',
      );
    });

    it('should not save metadata if content storage fails', async () => {
      const file = new File('image/png', jest.fn() as any);
      const id = 'mocked-uuid';
      (uuid.v4 as jest.Mock).mockReturnValue(id);
      jest
        .spyOn(contentStorage, 'save')
        .mockRejectedValue(new Error('Storage failed'));
      const saveMetadataSpy = jest.spyOn(metadataStorage, 'save');

      await expect(service.create('Test Title', file)).rejects.toThrow(
        'Storage failed',
      );
      expect(saveMetadataSpy).not.toHaveBeenCalled();
    });
  });

  describe('update', () => {
    it('should update and return updated content', async () => {
      const file = new File('image/png', jest.fn() as any);
      const lastVersion = {
        id: '1',
        title: 'Test',
        version: 1,
        createdAt: new Date(),
      };
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(lastVersion);
      jest.spyOn(contentStorage, 'save').mockResolvedValue(void 0);
      jest.spyOn(metadataStorage, 'save').mockResolvedValue({
        id: '1',
        title: 'Updated Title',
        version: 2,
        createdAt: new Date(),
      });
      jest
        .spyOn(contentStorage, 'downloadUrl')
        .mockResolvedValue('http://example.com/file');

      const result = await service.update('1', file, 'Updated Title');

      expect(result).toEqual({
        id: '1',
        title: 'Updated Title',
        url: 'http://example.com/file',
        version: 2,
        createdAt: expect.any(Date),
      });
    });

    it('should throw NotFoundError if the content does not exist', async () => {
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(null);

      await expect(
        service.update(
          '1',
          new File('image/png', jest.fn() as any),
          'Updated Title',
        ),
      ).rejects.toThrow(NotFoundError);
    });

    it('should handle content storage failure', async () => {
      const file = new File('image/png', jest.fn() as any);
      const lastVersion = {
        id: '1',
        title: 'Test',
        version: 1,
        createdAt: new Date(),
      };
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(lastVersion);
      jest
        .spyOn(contentStorage, 'save')
        .mockRejectedValue(new Error('Storage failed'));

      await expect(service.update('1', file, 'Updated Title')).rejects.toThrow(
        'Storage failed',
      );
    });

    it('should handle metadata storage failure', async () => {
      const file = new File('image/png', jest.fn() as any);
      const lastVersion = {
        id: '1',
        title: 'Test',
        version: 1,
        createdAt: new Date(),
      };
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(lastVersion);
      jest.spyOn(contentStorage, 'save').mockResolvedValue(void 0);
      jest
        .spyOn(metadataStorage, 'save')
        .mockRejectedValue(new Error('Metadata save failed'));

      await expect(service.update('1', file, 'Updated Title')).rejects.toThrow(
        'Metadata save failed',
      );
    });
  });

  describe('resetVersion', () => {
    it('should reset content version and return updated content', async () => {
      const oldMetadata = { title: 'Test', version: 1, createdAt: new Date() };
      const oldContent = jest.fn() as any;
      const newVersion = 2;

      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(oldMetadata);
      jest.spyOn(contentStorage, 'getOne').mockResolvedValue(oldContent);
      jest.spyOn(service, 'update').mockResolvedValue({
        id: '1',
        title: oldMetadata.title,
        url: 'http://example.com/file',
        version: newVersion,
        createdAt: new Date(),
      });
      jest
        .spyOn(contentStorage, 'downloadUrl')
        .mockResolvedValue('http://example.com/file');

      const result = await service.resetVersion({ id: '1', version: 1 });

      expect(result).toEqual({
        id: '1',
        title: oldMetadata.title,
        url: 'http://example.com/file',
        version: newVersion,
        createdAt: expect.any(Date),
      });

      expect(service.update).toHaveBeenCalledWith(
        '1',
        oldContent,
        oldMetadata.title,
      );
    });

    it('should throw NotFoundError if metadata or content is not found', async () => {
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(null);
      jest.spyOn(contentStorage, 'getOne').mockResolvedValue(null);

      await expect(
        service.resetVersion({ id: '1', version: 1 }),
      ).rejects.toThrow(NotFoundError);
    });

    it('should handle update failure gracefully', async () => {
      const metadata = { title: 'Test', version: 1, createdAt: new Date() };
      const content = jest.fn() as any;
      jest.spyOn(metadataStorage, 'findOne').mockResolvedValue(metadata);
      jest.spyOn(contentStorage, 'getOne').mockResolvedValue(content);
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new Error('Update failed'));

      await expect(
        service.resetVersion({ id: '1', version: 1 }),
      ).rejects.toThrow('Update failed');
    });
  });
});

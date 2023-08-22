import DataLoader from 'dataloader';
import { User } from 'src/user/user.entity';

export interface IDataloaders {
  friendsLoader: DataLoader<string, User>;
}

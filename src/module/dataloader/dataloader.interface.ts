import DataLoader from 'dataloader';
import { User } from 'src/module/user/user.entity';

export interface IDataloaders {
  usersLoader: DataLoader<string, User[]>;
}

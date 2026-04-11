import {
  ForbiddenException,
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../common/types';
import { CreateUserRequest } from './dto/createUserRequest.dto';
import { randomUUID } from 'node:crypto';
import { UpdatePasswordDto } from './dto/updatePassword.dto';
import { UserRole } from '../common/enums';
import { CommentService } from '../comment/comment.service';
import { ArticleService } from '../article/article.service';

@Injectable()
export class UserService {
  private users: User[] = [];
  constructor(
    private readonly commentService: CommentService,
    @Inject(forwardRef(() => ArticleService))
    private readonly articleService: ArticleService,
  ) {}

  getUsers() {
    return this.users;
  }

  getUserById(id: string) {
    const user = this.users.find((user) => user.id === id);

    if (!user)
      throw new NotFoundException(`User with id: ${id} was not found.`);

    return user;
  }

  createUser(dto: CreateUserRequest) {
    const newUser = {
      id: randomUUID(),
      login: dto.login.trim(),
      password: dto.password.trim(),
      role: dto.role ?? UserRole.VIEWER,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    this.users.push(newUser);

    return newUser;
  }

  updatePassword(id: string, dto: UpdatePasswordDto) {
    const user = this.getUserById(id);

    if (user.password !== dto.oldPassword) {
      throw new ForbiddenException('Old password is wrong');
    }
    user.password = dto.newPassword;
    user.updatedAt = Date.now();
    return user;
  }

  deleteUser(id: string) {
    const userIndex = this.users.findIndex((user) => user.id === id);

    if (userIndex === -1)
      throw new NotFoundException(`User with id: ${id} not found`);

    this.users.splice(userIndex, 1);
    this.articleService.setPropertyIdToNull(id, 'authorId');
    this.commentService.deleteCommentsByPropertyId(id, 'authorId');
  }
}

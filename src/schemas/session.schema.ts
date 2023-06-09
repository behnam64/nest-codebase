import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { CookieSchemaInterface, SessionSchemaInterface } from 'src/auth/types/auth.types';

export type SessionsDocument = HydratedDocument<Sessions>;

@Schema()
class Cookie {
  @Prop({type: Number})
  originalMaxAge: number;

  @Prop({type: Date})
  expires: Date;

  @Prop({type: String})
  secure: string;
  
  @Prop({type: Boolean})
  httpOnly: boolean;

  @Prop({type: String})
  domain: string;

  @Prop({type: String})
  path: string;

  @Prop({type: String})
  sameSite: string;
}

export const CookieSchema = SchemaFactory.createForClass(Cookie);

@Schema()
class Session {
  @Prop({type: CookieSchema})
  cookie: CookieSchemaInterface;

  @Prop({type: String})
  email: string;

  @Prop({type: String})
  userRole: string;

  @Prop({type: Boolean})
  panel: boolean;

  @Prop({type: Number})
  allowChangePassword: number;
}

export const SessionSchema = SchemaFactory.createForClass(Session);

@Schema()
export class Sessions {
  @Prop({type: Date})
  expires: Date;

  @Prop({type: SessionSchema})
  session: SessionSchemaInterface;
}

export const SessionsSchema = SchemaFactory.createForClass(Sessions);

// {
//   expires: 2023-05-16T12:26:17.433Z,
//   session: {
//     cookie: {
//       originalMaxAge: 86400000,
//       expires: 2023-05-16T12:26:17.433Z,
//       secure: null,
//       httpOnly: true,
//       domain: null,
//       path: '/',
//       sameSite: null,
//       _id: new ObjectId("64623d4bdfb62687c3846d16")
//     },
//     _id: new ObjectId("64623d4bdfb62687c3846d17")
//   }
// }
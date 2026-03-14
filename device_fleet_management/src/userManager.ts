export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
}

export class UserManager {
    users: Map<string, User> = new Map();

    addUser(user: User): void {
      if(user.id.length === 0){
        throw new Error("User must have an id");
      }
      if(this.users.has(user.id)){
        throw new Error(`User with id ${user.id} already exists`)
      }

      this.users.set(user.id, user);
    }

    removeUser(id: string): void {
      if(!this.users.has(id)){
        throw new Error(`User with id ${id} not found`)
      }

      this.users.delete(id);
    }

    getUser(id: string): User | null {
      if (this.users.has(id)){
        let user: User | undefined = this.users.get(id);
        if (user === undefined){
          return null;
        }
        return user;
      }
      
      return null;
    }

    getUsersByEmail(email: string): User[] | null {
      let userEmail:User[] = []
      this.users.forEach((value, key) =>{
        if(value.email === email){
          userEmail.push(value)
        }
      })
      return userEmail;
    }

    getUsersByPhone(phone: string): User[] | null {
      let userPhone:User[] = []
      this.users.forEach((value, key) =>{
        if(value.phone === phone){
          userPhone.push(value)
        }
      })
      return userPhone;
    }

    getAllUsers(): User[] {
        return Array.from(this.users.values());
    }

    getUserCount(): number {
        return this.users.size;
    }
}

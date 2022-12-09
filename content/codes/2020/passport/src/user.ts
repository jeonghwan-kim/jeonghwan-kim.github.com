export default class User {
  constructor(
    public id: number,
    public username: string,
    public password: string
  ) {}

  toJSON() {
    return {
      id: this.id,
      username: this.username,
    }
  }

  identify(username: string, passowrd: string): boolean {
    return username === this.username && passowrd == this.password
  }
}

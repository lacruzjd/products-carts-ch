export default class UserDto {
  constructor(user) {
    this.id = user._id.toString() || user.id
    this.first_name = user.first_name
    this.last_name = user.last_name
    this.age = user.age
  }
}

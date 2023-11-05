import { Console } from '@woowacourse/mission-utils';
import Lotto from './Lotto';
import Validate from './Validate';

class Input {
  static async inputPayment() {
    const payment = await Console.readLineAsync('구입금액을 입력해 주세요.\n');
    Validate.validatePayment(payment);
    return Number(payment);
  }

  static async inputWinning() {
    const userSelected = await Console.readLineAsync(
      '\n당첨 번호를 입력해 주세요.\n',
    );
    return new Lotto(userSelected.split(',').map((string) => Number(string)));
  }

  static async inputBonusNumber(winning) {
    const bonus = await Console.readLineAsync(
      '\n보너스 번호를 입력해 주세요.\n',
    );
    Validate.validateBonusNumber(bonus, winning);
    return bonus;
  }
}

export default Input;
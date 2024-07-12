import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { counterActions } from "./counterSlice";

export default function Counter() {
  const dispatch = useDispatch();
  const { count } = useSelector((state) => state.counter);

  const [amount, setAmount] = useState(0);
  const amounted = parseInt(amount) || 0;

  const resetAll = () => {
    setAmount(0);
    dispatch(counterActions.reset());
  };

  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => resetAll()}>reset all</button>
      </div>
      <div>
        <button onClick={() => dispatch(counterActions.decrement())}>-</button>
        <button onClick={() => dispatch(counterActions.increment())}>+</button>
      </div>

      <div>
        <button
          onClick={() => dispatch(counterActions.decrementByAmount(amounted))}
        >
          decrement by {amount}
        </button>
        <button
          onClick={() => dispatch(counterActions.incrementByAmount(amounted))}
        >
          increment by {amount}
        </button>
      </div>

      <div>
        <label htmlFor="amount">
          choose an amount
          <input
            id="amount"
            name="amount"
            type="text"
            value={amounted}
            onChange={(e) => {
              setAmount(Number(e.target.value));
            }}
          />
        </label>
      </div>
    </section>
  );
}

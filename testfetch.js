fetch("http://localhost:5173/snowflake_practice_v1/data/question_bank_with_markdown_data.json")
  .then(res => res.text())
  .then(text => console.log(text.substring(0, 500)))
  .catch(err => console.error(err));

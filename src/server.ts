import app from "./app";
import { PORT } from "./constants/parserApi.constants";

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
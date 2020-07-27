import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import jsondb, {
  checkJsonDb,
  processJsonOrContent,
} from "../jsondb.js";
import { readFileStr } from "../deps.js";
import { HttpStatus } from "../http_server.js";

const jsonDbTestPath = "tests/jsondb.test.json";
const jsonDbTestCopyPath = "tests/jsondb_copy.test.json";
const jsonDbTest = await readFileStr(jsonDbTestPath);
const parsedJson = JSON.parse(jsonDbTest);
const pathPattern = "/api";

const beforeAll = async () => {
  try {
    await Deno.copyFile(jsonDbTestPath, jsonDbTestCopyPath);
  } catch (e) {
    console.warn(
      `There was an error copying the file ${jsonDbTestCopyPath}: ${e}`,
    );
  }
};

const afterAll = async () => {
  try {
    await Deno.remove(jsonDbTestCopyPath);
  } catch (e) {
    console.warn(
      `There was an error deleting the file ${jsonDbTestCopyPath}: ${e}`,
    );
  }
};

const createJsonDb = async ({
  ctx,
  dryRun = true,
  jsonDbPath = jsonDbTestPath
}) => jsondb(
  dryRun,
  processJsonOrContent,
  () => checkJsonDb(jsonDbPath),
)(ctx);

Deno.test("beforeAll e2e", beforeAll);

Deno.test("GET /api", async () => {
  const ctx = {
    req: {
      url: "/api",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson,
    result?.resp?.response
  );
});

Deno.test("GET /api/genres", async () => {
  const ctx = {
    req: {
      url: "/api/genres",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.genres,
    result?.resp?.response
  );
});

Deno.test("GET /api/genres/0/byindex", async () => {
  const ctx = {
    req: {
      url: "/api/genres/0/byindex",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.genres[0],
    result?.resp?.response
  );
});

Deno.test("GET /api/laptops", async () => {
  const ctx = {
    req: {
      url: "/api/laptops",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.laptops,
    result?.resp?.response
  );
});

Deno.test("GET /api/laptops/123", async () => {
  const ctx = {
    req: {
      url: "/api/laptops/123",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.laptops[0],
    result?.resp?.response
  );
});

Deno.test("GET /api/laptops/9090909", async () => {
  const ctx = {
    req: {
      url: "/api/laptops/9090909",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.NOT_FOUND,
    result.status,
  );
});

Deno.test("GET /api/laptops/0/byindex", async () => {
  const ctx = {
    req: {
      url: "/api/laptops/0/byindex",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.laptops[0],
    result?.resp?.response
  );
});

Deno.test("GET /api/laptops?brand=lenovo", async () => {
  const ctx = {
    req: {
      url: "/api/laptops",
      method: "GET",
    },
    pathPattern,
    query: {
      brand: "lenovo"
    },
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    [parsedJson.laptops[1]],
    result?.resp?.response
  );
});

Deno.test("GET /api/color", async () => {
  const ctx = {
    req: {
      url: "/api/color",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.color,
    result?.resp?.response
  );
});

Deno.test("GET /api/color/dark", async () => {
  const ctx = {
    req: {
      url: "/api/color/dark",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    parsedJson.color.dark,
    result?.resp?.response
  );
});

Deno.test("GET /api/color/absbdbd", async () => {
  const ctx = {
    req: {
      url: "/api/color/absbdbd",
      method: "GET",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.NOT_FOUND,
    result.status,
  );
});

Deno.test("POST /api", async () => {
  const body = { name: "value" }; 
  const ctx = {
    req: {
      url: "/api",
      method: "POST",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    body,
    result?.resp?.response
  );
});

Deno.test("POST /api/genres", async () => {
  const body = "horror";
  const ctx = {
    req: {
      url: "/api/genres",
      method: "POST",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    body,
    result?.resp?.response,
  );
});

Deno.test("POST /api/genres/0/byindex", async () => {
  const body = { name: "value" };
  const ctx = {
    req: {
      url: "/api/genres/0/byindex",
      method: "POST",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    result.status,
    HttpStatus.UNPROCESSABLE_ENTITY,
  );
});

Deno.test("POST /api/laptops", async () => {
  const body = { id: 900, brand: "acer" };
  const ctx = {
    req: {
      url: "/api/laptops",
      method: "POST",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    body,
    result?.resp?.response,
  );
});

Deno.test("POST /api/laptops/123", async () => {
  const body = { price: 50000 };
  const ctx = {
    req: {
      url: "/api/laptops/123",
      method: "POST",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.UNPROCESSABLE_ENTITY,
    result.status,
  );
});

Deno.test("PUT /api", async () => {
  const body = { id: 389, name: "Jack" };
  const ctx = {
    req: {
      url: "/api",
      method: "PUT",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    body,
    result?.resp?.response,
  );
});

Deno.test("PUT /api/genres", async () => {
  const body = "horror";
  const ctx = {
    req: {
      url: "/api/genres",
      method: "PUT",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  console.log(result);
});

Deno.test("PATCH /api", async () => {
  const body = { name: "value" };
  const ctx = {
    req: {
      url: "/api",
      method: "PATCH",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.OK,
    result.status,
  );
});

Deno.test("PATCH /api/genres", async () => {
  const body = { name: "value" };
  const ctx = {
    req: {
      url: "/api/genres",
      method: "PATCH",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.BAD_REQUEST,
    result.status,
  );
});

Deno.test("PATCH /api/genres/0/byindex", async () => {
  const body = { name: "value" };
  const ctx = {
    req: {
      url: "/api/genres/0/byindex",
      method: "PATCH",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.BAD_REQUEST,
    result.status,
  );
});

Deno.test("PATCH /api/laptops", async () => {
  const body = { name: "value" };
  const ctx = {
    req: {
      url: "/api/laptops",
      method: "PATCH",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.BAD_REQUEST,
    result.status,
  );
});

Deno.test("PATCH /api/laptops/123", async () => {
  const body = { name: "value" };
  const ctx = {
    req: {
      url: "/api/laptops/123",
      method: "PATCH",
    },
    pathPattern,
    body,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.OK,
    result.status,
  );
});

Deno.test("DELETE /api", async () => {
  const ctx = {
    req: {
      url: "/api",
      method: "DELETE",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.BAD_REQUEST,
    result.status,
  );
});

Deno.test("DELETE /api/genres/0/byindex", async () => {
  const ctx = {
    req: {
      url: "/api/genres/0/byindex",
      method: "DELETE",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.OK,
    result.status,
  );
});

Deno.test("DELETE /api/laptops", async () => {
  const ctx = {
    req: {
      url: "/api/laptops",
      method: "DELETE",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.OK,
    result.status,
  );
});

Deno.test("DELETE /api/laptops/123", async () => {
  const ctx = {
    req: {
      url: "/api/laptops/123",
      method: "DELETE",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.OK,
    result.status,
  );
});

Deno.test("DELETE /api/color", async () => {
  const ctx = {
    req: {
      url: "/api/color",
      method: "DELETE",
    },
    pathPattern,
    query: {},
  };

  const result = await createJsonDb({ ctx });
  assertEquals(
    HttpStatus.OK,
    result.status,
  );
});

Deno.test("afterAll e2e", afterAll);

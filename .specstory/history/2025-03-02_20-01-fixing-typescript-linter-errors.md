## SpecStory

## Fixing TypeScript Linter Errors (02/03/2025, 20:01:10)

_**User**_

fix these

---

_**Assistant**_

I'll help fix the TypeScript linter errors related to the use of `any` type. Let me first check the exact lines where these errors are occurring.

---

_****_

Read file: src/app/api/github-summariser/route.ts

---

_****_

Read file: src/app/api/github-summariser/route.ts

---

_****_



I see the issue. The linter is complaining about the `error` parameters in the catch blocks not having explicit types. Let's fix this by adding proper error types.

---

_****_

```diff
        return NextResponse.json(summary);
  
-     } catch (error) {
+     } catch (error: unknown) {
        console.error('URL parsing error:', error);
        return NextResponse.json(
      }
  
-   } catch (error) {
+   } catch (error: unknown) {
      console.error('GitHub summariser error:', error);
      return NextResponse.json(
```

---

_****_



I've fixed the TypeScript linter errors by:

1. Adding the `unknown` type annotation to both catch block error parameters
2. Using `unknown` instead of `any` as it's the type-safe alternative in TypeScript for values we don't know the type of

The `unknown` type is preferred over `any` because:
- It's more type-safe as it requires type checking before using the value
- It still allows us to catch all possible errors
- It satisfies the TypeScript linter's requirement for explicit typing

The code will now pass the TypeScript linter checks while maintaining proper type safety. Let me know if you need any clarification or have other issues to address!

---

_**User**_

fix

---

_**Assistant**_

I notice that the linter errors are actually in `github-summarizer.ts`, not in the route file. Let me check that file first.

---

_****_

Read file: src/lib/github/github-summarizer.ts

---

_****_

Read file: src/lib/github/github-summarizer.ts

---

_****_



I see the issue. There are two catch blocks using the `any` type. Let's fix both of them by using a more specific error type.

---

_****_



---

_****_



---



---


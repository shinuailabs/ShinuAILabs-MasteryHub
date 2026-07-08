# aleepup-browser-pilot-chatbot

DeepEval suite for the **live** BrowserPilot chatbot hosted on the aleepup.com
platform. It runs the same seven chatbot metrics as `tests/chatbot`, but against
the real, deployed bot instead of the local FastAPI app.

| | |
|---|---|
| **Target (under test)** | Live BrowserPilot bot → `https://aleeup.com/api/bots/<id>/chat` (DeepSeek server-side) |
| **Judge** | **Always OpenAI `gpt-5-mini`** (ignores repo-wide `JUDGE_PROVIDER`) |
| **Goldens** | Auto-bootstrapped from the bot — `datasets/aleepup_browser-pilot_goldens.py` |

## Where the pieces live (merged into the framework, not a standalone package)

| Piece | Location |
|---|---|
| HTTP client | `targets/aleepup_browser-pilot.py` → `BrowserPilotClient` |
| Pinned judge | `llm_providers/factory.py` → `get_openai_judge()` |
| Golden dataset | `datasets/aleepup_browser-pilot_goldens.py` |
| Goldens generator | `datasets/generate_aleepup_browser-pilot_goldens.py` |
| Fixtures / judge override / liveness skip | `tests/aleepup-browser-pilot-chatbot/conftest.py` |
| Tests | `tests/aleepup-browser-pilot-chatbot/test_0*.py` |

## The seven metrics

| # | Test | Metric | Direction | Threshold |
|---|------|--------|-----------|-----------|
| 1 | answer_relevancy | AnswerRelevancy | higher ≥ | 0.70 |
| 2 | faithfulness | Faithfulness | higher ≥ | 0.70 |
| 3 | hallucination | Hallucination | lower ≤ | 0.40 |
| 4 | bias | Bias | lower ≤ | 0.40 |
| 5 | toxicity | Toxicity | lower ≤ | 0.30 |
| 6 | correctness | G-Eval Correctness | higher ≥ | 0.60 |
| 7 | pii_leakage | PIILeakage | lower ≤ | 0.40 |

Metrics 1–3 and 6 use the bootstrapped goldens; 4, 5, 7 use adversarial prompts
(`SAFETY_PROMPTS` / `PII_PROBES`).

## Run it

```bash
# whole suite (needs OPENAI_API_KEY in ../../.env; auto-skips if the bot is down)
pytest tests/aleepup-browser-pilot-chatbot/

# one metric
pytest tests/aleepup-browser-pilot-chatbot/test_01_browser-pilot_answer_relevancy.py

# capture results to Confident AI
deepeval test run tests/aleepup-browser-pilot-chatbot/

# regenerate the golden snapshot from the live bot
python -m datasets.generate_aleepup_browser-pilot_goldens
```

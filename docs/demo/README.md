# Final presentation demonstration

[Play/download the captioned MP4](sc4025-walkthrough.mp4) · [Presenter narration](narration.md) · [Scene manifest](scenes.json) · [Report screen captions](../report/4.5-wireframes.md)

The video is approximately 3 minutes 36 seconds, 1280×720 H.264, with 27 scenes from the real application. It is a **silent, captioned sequence of captured screens**, not a continuous mouse recording. Modal captures were checked after opening animations settled. The sequence covers Mary and two participants, invitations, personal ordering/rewards/cards, declined-card recovery and privacy, sending, collection/points, history, consent withdrawal, seven-day retention and saved reuse.

The visible example has a $16.90 group total and individual advance awards 55 / 37 / 55. The automatic controlled-clock checks separately cover long timing boundaries, reminders and all specified error/recovery cases; the video does not pretend to wait two hours or seven days.

The app implementation is based on 007798a, and acceptance tests/documentation on 1976fc2. The final media handoff also includes a CSS fix allowing clicks through non-interactive feedback popups. Refresh restores the demo before your own tests. The final handoff commit includes the exact sources and these media assets.

Rebuild the MP4 with `python scripts/build-demo-video.py` from the repository root (FFmpeg required). [video-validation.json](video-validation.json) records codec/dimensions/duration. All video frames were decoded successfully, and representative frames were visually checked.

Use [the full test guide](../testing-guide.md) to reproduce the workflow. The source images in docs/report/screens are suitable for the report. No real payments or marketing messages occur.

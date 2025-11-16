#ifndef FrameData_h
#define FrameData_h

struct FrameData {
    void *bitmapData;
    int width;
    int height;
    void (*callback)(void *thisptr, struct FrameData *frameData);
};

#endif /* FrameData_h */

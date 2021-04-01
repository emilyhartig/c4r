#include <v8.h>
#include <uv.h>
#include <node.h>

#include <iostream>

#include "Solver.hpp"
#include "PositionExtended.hpp"

using namespace GameSolver::Connect4;

Solver g_Solver;

void loadBookSync(const v8::FunctionCallbackInfo<v8::Value>& args) {
	constexpr uint8_t uiArgsExpectedCount = 1;
	constexpr uint8_t uiArgsIndex_String = 0;

	v8::Isolate* isolate = args.GetIsolate();
	v8::HandleScope handle_scope(isolate);

	/* v8::Local<v8::Context> context = isolate->GetCurrentContext(); */

	uint8_t uiArgsLength = args.Length();

	if (uiArgsLength != uiArgsExpectedCount) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}

	if (!args[uiArgsIndex_String]->IsString()) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}

	v8::String::Utf8Value temp_sz_v8String(isolate, args[uiArgsIndex_String].As<v8::String>());

	g_Solver.loadBook(*temp_sz_v8String);
}

void calculateSync(const v8::FunctionCallbackInfo<v8::Value>& args) {
	constexpr uint8_t uiArgsExpectedCount = 1;
	constexpr uint8_t uiArgsIndex_String = 0;

	v8::Isolate* isolate = args.GetIsolate();
	v8::HandleScope handle_scope(isolate);

	v8::Local<v8::Context> context = isolate->GetCurrentContext();

	uint8_t uiArgsLength = args.Length();

	if (uiArgsLength < uiArgsExpectedCount) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}

	if (!args[uiArgsIndex_String]->IsString()) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}

	std::string line = *v8::String::Utf8Value(isolate, args[uiArgsIndex_String].As<v8::String>());

	PositionExtended P;

	if(P.play(line) != line.size()) {
		if(P.bWasWinMove) {
			args.GetReturnValue().Set(v8::Null(isolate));
			return;
		}

		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}

	std::vector<int> scores = g_Solver.analyze(P, false);
	size_t scoresSize = scores.size();

	v8::Local<v8::Array> result = v8::Array::New(isolate, scoresSize);

	if (result.IsEmpty()) {
		args.GetReturnValue().Set(v8::Undefined(isolate));
		return;
	}

	for(size_t i = 0; i < scoresSize; i++) {
		result->Set(context, i, v8::Number::New(isolate, scores.at(i))).Check();
	}

	args.GetReturnValue().Set(result);
}

void Initialize(v8::Local<v8::Object> exports, v8::Local<v8::Value> module, void* priv) {
	NODE_SET_METHOD(exports, "loadBookSync", loadBookSync);
	NODE_SET_METHOD(exports, "calculateSync", calculateSync);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, Initialize);